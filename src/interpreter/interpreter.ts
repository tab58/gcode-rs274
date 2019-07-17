import { MidlineWordBlock, LineBlock, TokenType, SetParameterValueBlock } from '../parser/syntaxTree';
import { evaluateRealValueBlock, EvaluationContext } from './evaluateExpression';
import { modalGroupAddressCodes } from './modals';
import { sortByExecutionOrder } from './sortByExecutionOrder';
import { WordBlock, CommandBlock } from './types';
import { areWordsUnique, hasLessThan5MWords } from './validate/word';
import { areModalsUnique, areModalNonModalsClashing } from './validate/command';
import { defaultParameters } from './defaultParameters';

/** Provides a table from RS274 parameter values. */
class ParameterTable implements EvaluationContext {
  private _parameterTable: { [key: string]: number };

  public constructor (parameters: { [key: string]: number } = defaultParameters) {
    this._parameterTable = Object.assign({}, parameters);
  }

  public get (param: number): number {
    return this._parameterTable[param];
  }

  public set (param: number, value: number): void {
    this._parameterTable[param] = value;
  }

  public clone (): ParameterTable {
    const newStore = Object.assign({}, this._parameterTable);
    const table = new ParameterTable(newStore);
    return table;
  }
}

/**
 * Builds the commands for RS274 code. Contains set parameter values for real number evaluation.
 */
export class RS274Interpreter {
  /** The parameter store. */
  private _parameterTable: ParameterTable;

  public getParameterTable (): ParameterTable { return this._parameterTable.clone(); }

  public constructor (table?: { [key: string]: number }) {
    this._parameterTable = new ParameterTable(table);
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
      if (modalGroupAddressCodes.includes(address)) { // if code is G, M
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
    if (!areWordsUnique(words)) { throw new Error('Letter codes other than G or M must be unique.'); }
    if (!hasLessThan5MWords(words)) { throw new Error('Line has 5 or more M-words.'); }

    // build words on line into command blocks
    const commandBlocks = this._buildCommandBlocks(words);

    // do checks for errors on commands
    if (!areModalsUnique(commandBlocks)) { throw new Error('2 or more G-code command from the same modal group are present.'); }
    if (areModalNonModalsClashing(commandBlocks)) { throw new Error('G-code modal/nonmodal clash check failed.'); }

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