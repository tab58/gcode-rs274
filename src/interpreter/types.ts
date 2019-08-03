import {
  ModalGroupName,
  NonmodalGroupName,
  isFromModalGroup,
  isFromNonmodalGroup,
  getModalGroupName,
  getNonmodalGroupName,
  nonModalCodes
} from './modals';

export interface Word {
  code: string;
  value: number;
}

export interface ParameterContext {
  [key: string]: number;
}

/** Represents a word block (e.g. "X23"). */
export class WordBlock implements Word {
  /** The letter part of the block, e.g. "X". */
  public readonly code: string;
  /** The numeric part of the block, e.g. "23". */
  public readonly value: number;

  public constructor (code: string, value: number) {
    this.code = code;
    this.value = value;
  }

  public hasCode (s: string): boolean {
    return (this.code === s);
  }

  public hasValue (code: number): boolean {
    return (this.value === code);
  }

  public clone (): WordBlock {
    return new WordBlock(this.code, this.value);
  }

  public equalsWord (word: WordBlock): boolean {
    return this.equals(word.code, word.value);
  }

  public equals (code: string, value: number): boolean {
    return (this.code === code && this.value === value);
  }
}


export class WordCollection {
  private _words: { [key: string]: number }
  private _commands: WordBlock[];

  public constructor () {
    this._words = {};
    this._commands = [];
  }

  private _isCommand (word: WordBlock): boolean {
    return (getModalGroupName(word.code, word.value) || getNonmodalGroupName(word.code, word.value)) !== undefined;
  }

  public hasCommand (code: string, value: number): boolean {
    return this._commands.reduce((acc: boolean, command: WordBlock): boolean => {
      return acc || (command.code === code && command.value === value);
    }, false);
  }

  public hasModalCommandInGroup (name: ModalGroupName): boolean {
    return this._commands.reduce((acc: boolean, command: WordBlock): boolean => {
      return acc || isFromModalGroup(command.code, command.value, name);
    }, false);
  }

  public hasNonmodalCommandInGroup (name: NonmodalGroupName): boolean {
    return this._commands.reduce((acc: boolean, command: WordBlock): boolean => {
      return acc || isFromNonmodalGroup(command.code, command.value, name);
    }, false);
  }

  public hasAnyNonmodalCommandInGroup (): boolean {
    return Object.keys(nonModalCodes).reduce((acc: boolean, name: NonmodalGroupName): boolean => {
      return acc || this._commands.reduce((acc1: boolean, command: WordBlock): boolean => {
        return acc1 || isFromNonmodalGroup(command.code, command.value, name);
      }, false);
    }, false);
  }

  public addWord (word: WordBlock): void {
    if (this._isCommand(word)) {
      this._commands.push(word);
    } else {
      const { code, value } = word;
      if (this._words[code]) {
        throw new Error(`Non-unique non-command word: ${code}${value}`);
      }
      this._words[code] = value;
    }
  }

  public forEachCommand (callback: (command: WordBlock, words: { [key: string]: number }) => void): void {
    const s = Object.assign({}, this._words);
    return this._commands.forEach((command: WordBlock): void => {
      callback(command, s);
    });
  }

  public reduceCommands<T> (callback: (acc: T, command: WordBlock, words: { [key: string]: number }) => T, initialValue: T): T {
    const s = Object.assign({}, this._words);
    return this._commands.reduce((acc: T, command: WordBlock): T => {
      return callback(acc, command, s);
    }, initialValue);
  }

  public mapCommands<T> (mapFn: (command: WordBlock, words: { [key: string]: number }) => T): T[] {
    const s = Object.assign({}, this._words);
    return this._commands.map((command: WordBlock): T => {
      return mapFn(command, s);
    });
  }

  /** Returns the value of the given word code, undefined if not. */
  public getWordValue (code: string): number { return this._words[code]; }
}

/** Represents a full command block (e.g. "G0 X0.33 Y-0.25 Z0.5"). */
export class CommandBlock {
  public readonly command: Word;
  // private _words: Word[];
  private _wordObject: { [key: string]: any } = {};

  /** Returns the value of the given word code, undefined if not. */
  public getWordValue (code: string): number { return this._wordObject[code]; }

  public constructor (command: Word) {
    this.command = command;
    this._wordObject = {
      [command.code]: command.value
    };
  }

  public addWord (word: Word): void {
    this._wordObject[word.code] = word.value;
  }

  public addWordByParts (code: string, value: number): void {
    const word = { code, value };
    this.addWord(word);
  }
}