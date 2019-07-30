export interface ParameterContext {
  [key: string]: number;
}

/** Represents a word block (e.g. "X23"). */
export class WordBlock {
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

  public equals (word: WordBlock): boolean {
    return (this.code === word.code && this.value === word.value);
  }
}

/** Represents a full command block (e.g. "G0 X0.33 Y-0.25 Z0.5"). */
export class CommandBlock {
  public readonly command: WordBlock;
  private _words: WordBlock[];
  private _wordObject: { [key: string]: any } = {};

  public get words (): WordBlock[] { return this._words.slice(); }
  
  public getWordValue (code: string): number { return this._wordObject[code]; }

  public constructor (command: WordBlock) {
    this.command = command;
    this._words = [];
    this._wordObject = {
      [command.code]: command.value
    };
  }

  public addWord (word: WordBlock): void {
    this._words.push(word);
    this._wordObject[word.code] = word.value;
  }

  public forEachWord (callback: (value: WordBlock, index: number, array: WordBlock[]) => void): void {
    this._words.forEach(callback, this);
    for (let i = 0; i < this._words.length; ++i) {
      callback(this._words[i], i, this._words);
    }
  }

  public reduceWords<T> (callback: (previousValue: T, currentValue: WordBlock, currentIndex: number, array: WordBlock[]) => T, initialValue: T): T {
    return this._words.reduce<T>(callback, initialValue);
  }
}