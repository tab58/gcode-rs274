export interface ParameterContext {
  [key: string]: number;
}

/** Represents a word block (e.g. "X23"). */
export class WordBlock {
  /** The letter part of the block, e.g. "X". */
  public readonly address: string;
  /** The numeric part of the block, e.g. "23". */
  public readonly code: number;

  public constructor (address: string, code: number) {
    this.address = address;
    this.code = code;
  }
}

/** Represents a full command block (e.g. "G0 X0.33 Y-0.25 Z0.5"). */
export class CommandBlock {
  public readonly command: WordBlock;
  private _words: WordBlock[];
  public get words (): WordBlock[] { return this._words.slice(); }

  public constructor (address: WordBlock) {
    this.command = address;
    this._words = [];
  }

  public addWord (word: WordBlock): void {
    this._words.push(word);
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