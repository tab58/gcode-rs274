import { MidlineWordBlock, LineBlock, TokenType, SetParameterValueBlock } from '../parser/syntaxTree';
import { evaluateRealValueBlock, EvaluationContext } from './evaluateRealValueBlock';
import { sortByExecutionOrder } from './sortByExecutionOrder';
import { WordBlock, CommandBlock } from './types';
import { defaultParameters } from './defaultParameters';

import { validateLineWords } from './validate/word';
import { modalCodes, getCommandGroupName, getCommandGroupNameForNonCommandWord } from './validate/modals';


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

/** Interprets commands by scanning individual words. */
class CommandInterpreter {
  private _currentModals: { [key: string]: WordBlock };
  private _currentCommand: WordBlock;

  public command (): WordBlock { return this._currentCommand; }

  public constructor () {
    this._currentModals = {};
  }

  public interpretCommandsFromWords (words: WordBlock[]): CommandBlock[] {
    let commandObject: { [key: string]: CommandBlock } = {};
    let otherCommands: CommandBlock[] = [];

    for (let i = 0; i < words.length; ++i) {
      const word = words[i];

      // figure out which command the word belongs to
      const commandGroupName = getCommandGroupName(word.code, word.value);
      if (commandGroupName) {
        const savedCommandBlock = commandObject[commandGroupName];
        if (!savedCommandBlock) {
          // if no block, create one
          const newCommand = new CommandBlock(word);
          commandObject[commandGroupName] = newCommand;
        } else {
          // there's a command from the same modal group, error.
          const { code, value } = savedCommandBlock.command;
          throw new Error(`Duplicate modals from same group: "${word.code}${word.value}" and "${code}${value}".`);
        }
      } else {
        // it's not a command word, so grab the modal group it belongs to
        const modalCommandGroup = getCommandGroupNameForNonCommandWord(word.code);
        if (modalCommandGroup) {
          const savedCommand = commandObject[modalCommandGroup];
          if (savedCommand) {
            savedCommand.addWord(word);
          } else {
            otherCommands.push(new CommandBlock(word));
          }
        } else {
          // then I don't know what it is
          throw new Error(`Word not recognized: "${word.code}${word.value}".`);
        }
      }
    }
    // put the modals into the currentModals list
    Object.keys(modalCodes).forEach((modalGroup: string): void => {
      const currentCommand = commandObject[modalGroup];
      if (currentCommand) {
        this._currentModals[modalGroup] = currentCommand.command;
      }
    });

    // get the command list from the object
    const commands = Object.keys(commandObject).map((name: string): CommandBlock => commandObject[name]);
    return sortByExecutionOrder([...commands, ...otherCommands]);
  }
}

/**
 * Builds the commands for RS274 code. Contains set parameter values for real number evaluation.
 */
export class RS274Interpreter {
  /** The parameter store. */
  private _parameterTable: ParameterTable;

  /** The modal table for creating commands. */
  private _commandInterpreter: CommandInterpreter;

  public getParameterTable (): ParameterTable { return this._parameterTable.clone(); }
  public constructor (table?: { [key: string]: number }) {
    this._parameterTable = new ParameterTable(table);
    this._commandInterpreter = new CommandInterpreter();
  }

  /**
   * Interprets a RS274 line.
   * @param ast The abstract syntax tree for the line.
   */
  public readLine (ast: LineBlock): CommandBlock[] {
    const { segments } = ast;
    const words: WordBlock[] = (segments.filter((segment): boolean => segment.isType(TokenType.MidlineWord)) as MidlineWordBlock[])
      .map((word: MidlineWordBlock): WordBlock => {
        const evaledValue = evaluateRealValueBlock(word.value, this._parameterTable);
        return new WordBlock(word.code, evaledValue);
      });
    
    validateLineWords(words);

    // build words on line into command blocks
    // const commandBlocks = this._buildCommandBlocks(words);
    // const sortedCommandBlocks = sortByExecutionOrder(commandBlocks);
    const sortedCommandBlocks = this._commandInterpreter.interpretCommandsFromWords(words);

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