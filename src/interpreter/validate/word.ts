import uniqBy from 'lodash.uniqby';
import { WordBlock } from '../types';

/** Tests for duplicates in word address. */
export function areWordsUnique (words: WordBlock[]): boolean {
  const uniqueWords = uniqBy(words, (word: WordBlock): string => word.address);
  return (words.length === uniqueWords.length);
}

/** Tests if the line has less than 5 M-codes. */
export function hasLessThan5MWords (words: WordBlock[]): boolean {
  const numMCodes = words.reduce((acc: number, word: WordBlock): number => (word.address === 'M') ? acc + 1 : acc, 0);
  return (numMCodes < 5);
}