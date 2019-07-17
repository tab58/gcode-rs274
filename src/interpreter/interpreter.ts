import uniqBy from 'lodash.uniqby';

import { MidlineWordBlock, LineBlock, TokenType, SetParameterValueBlock } from '../parser/syntaxTree';
import { evaluateRealValueBlock, EvaluationContext } from './evaluate/expression';
import { modalGroups, modalAddressCodes, getModalGroup, isNonmodalCode, nonModalGroups, axisWordAddresses } from './modals';
import { sortByExecutionOrder } from './commandOrder';
import { WordBlock, CommandBlock } from './types';

/** Provides a table from RS274 parameter values. */
class ParameterTable implements EvaluationContext {
  private _parameterTable: { [key: string]: number };

  public constructor () {
    this._parameterTable = {};
  }

  public changeParamStore (store: { [key: string]: number }): void {
    this._parameterTable = store;
  }

  public get (param: number): number {
    return this._parameterTable[param];
  }

  public set (param: number, value: number): void {
    this._parameterTable[param] = value;
  }

  public clone (): ParameterTable {
    const newStore = Object.assign({}, this._parameterTable);
    const table = new ParameterTable();
    table.changeParamStore(newStore);
    return table;
  }
}

/**
 * An interpreter for RS274 code. Works as a state machine for single line interpretation.
 */
export class RS274Interpreter {
  /** The parameter store. */
  private _parameterTable: ParameterTable;

  public getParameterTable (): ParameterTable { return this._parameterTable.clone(); }

  public loadParameterTable (table: { [key: string]: number }): void { this._parameterTable.changeParamStore(table); }

  public constructor () {
    this._parameterTable = new ParameterTable();
  }

  /**
   * Creates command blocks, which are a specific G-code command (e.g. "G23") and associated words
   * (e.g. "X1.304", "Y-0.25", etc.).
   * @param words The words from the line.
   */
  private _buildCommandBlocks (words: WordBlock[]): CommandBlock[] {
    // build the command blocks
    const commandBlocks = [];
    let currentAddress;
    for (let i = 0; i < words.length; ++i) {
      const currentWord = words[i];
      const { address } = currentWord;
      if (modalAddressCodes.includes(address)) { // if code is G or M
        // create a new modal command and add the old one, if it exists, to the addressBlocks.
        if (currentAddress) { commandBlocks.push(currentAddress); }
        currentAddress = new CommandBlock(currentWord);
      } else {
        if (currentAddress) {
          currentAddress.addWord(currentWord);
        } else {
          throw new Error('No modal code for address.');
        }
      }
    }
    if (currentAddress) { commandBlocks.push(currentAddress); }
    return commandBlocks;
  }

  /**
   * Determines if the address blocks for the line have 2 or more commands from the same modal group.
   * @param commandBlocks The address blocks for the line.
   * @returns {boolean} Returns true if modals do not interfere, false if they do.
   */
  private _areModalsUnique (commandBlocks: CommandBlock[]): boolean {
    if (commandBlocks.length === 0) {
      console.warn('WARN: No modal commands.');
      return true;
    }
    const modalGroups = commandBlocks.map((addressBlock: CommandBlock): string => {
      const { address, code } = addressBlock.command;
      const group = getModalGroup(address, code);
      return group;
    });
    const [groupName, ...groupNames] = modalGroups;
    if (groupNames.length > 0) {
      return !groupNames.reduce((acc: boolean, groupNameStr: string): boolean => (acc || (groupName === groupNameStr)), false);
    } else {
      return true;
    }
  }

  /**
   * Checks if the commands have axis-related words.
   */
  private _groupHasAxisWords (commandBlocks: CommandBlock[]): boolean {
    return commandBlocks.reduce((acc1: boolean, commandBlock: CommandBlock): boolean => {
      return (acc1 || commandBlock.reduceWords((acc2: boolean, word: WordBlock): boolean => {
        return (acc2 || axisWordAddresses.includes(word.address));
      }, false));
    }, false);
  }

  /**
   * Determines if the address blocks contain Group 0 and Group 1 commands, and if yes,
   * they determine if there are Group 0 (nonmodal) and Group 1 (modal) commands with axis words.
   * @param commandBlock The address blocks.
   * @returns {boolean} True if there is an error, false if not.
   */
  private _doModalsClashWithNonmodals (commandBlock: CommandBlock[]): boolean {
    const gBlocks = commandBlock.filter((commandBlock: CommandBlock): boolean => commandBlock.command.address === 'G');
    if (gBlocks.length !== 0) {
      const g1 = modalGroups.G.motion;
      const g0 = nonModalGroups.G.all;
      
      const g0Blocks = gBlocks.filter((block: CommandBlock): boolean => g0.includes(block.command.code));
      const g1Blocks = gBlocks.filter((block: CommandBlock): boolean => g1.includes(block.command.code));
      if (g0Blocks.length !== 0 && g1Blocks.length !== 0) {
        const g0HasAxes = this._groupHasAxisWords(g0Blocks);
        const g1HasAxes = this._groupHasAxisWords(g1Blocks);
        return (g0HasAxes && g1HasAxes);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Checks if modals and nonmodal codes clash.
   */
  private _doModalNonModalCodesClash (commandBlocks: CommandBlock[]): boolean {
    // check to see if Group 1 and Group 0 are present, and if so
    // see if they use axis words. If yes, then throw an error.
    const nonModalCodes = commandBlocks.filter((cmdBlock: CommandBlock): boolean => {
      const { address, code } = cmdBlock.command;
      return isNonmodalCode(address, code);
    });
    const modalNonmodalClash = (nonModalCodes.length > 0)
      ? this._doModalsClashWithNonmodals(commandBlocks)
      : false;

    return modalNonmodalClash;
  }

  /** Tests for duplicates in word address. */
  private _areWordsUnique (words: WordBlock[]): boolean {
    const uniqueWords = uniqBy(words, (word: WordBlock): string => word.address);
    return (words.length === uniqueWords.length);
  }

  /** Tests if the line has less than 5 M-codes. */
  private _hasLessThan5MCodes (words: WordBlock[]): boolean {
    const numMCodes = words.reduce((acc: number, word: WordBlock): number => (word.address === 'M') ? acc + 1 : acc, 0);
    return (numMCodes < 5);
  }

  /**
   * Interprets a RS274 line.
   * @param ast The abstract syntax tree for the line.
   */
  public readLine (ast: LineBlock): CommandBlock[] {
    const { segments } = ast;
    const words = (segments.filter((segment): boolean => segment.isType(TokenType.MidlineWord)) as MidlineWordBlock[])
      .map((word: MidlineWordBlock): WordBlock => {
        const evaledValue = evaluateRealValueBlock(word.value, this._parameterTable);
        return new WordBlock(word.code, evaledValue);
      });
    
    // do checks errors on words
    if (!this._areWordsUnique(words)) {
      throw new Error('Letter codes other than G or M must be unique.');
    }
    if (!this._hasLessThan5MCodes(words)) {
      throw new Error('Line has 5 or more M-words.');
    }

    // build words on line into command blocks
    const commandBlocks = this._buildCommandBlocks(words);

    // do checks for errors on commands
    if (!this._areModalsUnique(commandBlocks)) {
      throw new Error('2 or more G-code command from the same modal group are present.');
    }
    if (this._doModalNonModalCodesClash(commandBlocks)) {
      throw new Error('G-code modal/nonmodal clash check failed.');
    }

    // sort the blocks in execution order
    const sortedCommandBlocks = sortByExecutionOrder(commandBlocks);

    // change the parameter values after the numbers has been evaluated.
    (segments.filter((segment): boolean => segment.isType(TokenType.SetParameterValue)) as SetParameterValueBlock[])
      .forEach((setParamValue: SetParameterValueBlock): void => {
        const param = evaluateRealValueBlock(setParamValue.parameter, this._parameterTable);
        const value = evaluateRealValueBlock(setParamValue.value, this._parameterTable);
        this._parameterTable.set(param, value);
      });

    return sortedCommandBlocks;
  }
}