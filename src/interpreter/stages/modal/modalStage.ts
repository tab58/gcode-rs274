import uniqBy from 'lodash.uniqby';

import {
  modalAxisLetters,
  modalCommandLetters,
  ModalGroupName,
  NonmodalGroupName,
  getModalGroupName,
  isFromModalGroup,
  isFromNonmodalGroup,
} from '../../modals';
import { ValidationRule } from './validationRule';
import { InterpreterStage } from '../interpreterStage';
import { Word, WordBlock, WordCollection } from '../../types';

const lineValidationRules = [
  new ValidationRule<Word[]>('2 G-words cannot be from the same modal group', (words: Word[]): boolean => {
    const gWords = words.filter((w): boolean => w.code === 'G');
    const gModalGroups = gWords.map((word: Word): string => getModalGroupName(word.code, word.value));
    // check if there is no group; error if yes
    const blankGroups = gModalGroups.filter((modal: string): boolean => modal === undefined);
    if (blankGroups.length > 0) {
      for (let i = 0; i < gModalGroups.length; ++i) {
        if (gModalGroups[i] === undefined) {
          const errorWord = gWords[i];
          throw new Error(`Invalid command word: "${errorWord.code}${errorWord.value}".`);
        }
      }
      return false;
    }
    const uniqueGroups = uniqBy(gModalGroups, (group: string): string => group);
    return (uniqueGroups.length === gModalGroups.length);
  }),
  new ValidationRule<Word[]>('must only have 4 or less M-words', (words: Word[]): boolean => {
    const mWords = words.filter((word: Word): boolean => word.code === 'M');
    return (mWords.length <= 4);
  }),
  new ValidationRule<Word[]>('group 0 and group 1 must not appear on the same line is axis words are present', (words: Word[]): boolean => {
    const g0Words = words.filter((word: Word): boolean => isFromNonmodalGroup(word.code, word.value, NonmodalGroupName.HasAxisWords));
    const g1Words = words.filter((word: Word): boolean => isFromModalGroup(word.code, word.value, ModalGroupName.GMotion));
    if (g0Words.length > 0 && g1Words.length > 0) {
      const axisWords = words.filter((word: Word): boolean => modalAxisLetters.includes(word.code));
      if (axisWords.length > 0) {
        return false;
      }
    }
    return true;
  }),
  new ValidationRule<Word[]>('non-command words must have unique letters', (words: Word[]): boolean => {
    const nonCommandWords = words.filter((word: Word): boolean => !modalCommandLetters.includes(word.code));
    const uniqueWords = uniqBy(nonCommandWords, (word: Word): string => word.code);
    return (nonCommandWords.length === uniqueWords.length);
  })
];

/** Validates an array of line words based on a series of rules. */
export const validateLineWords = (lineWords: Word[], throwOnInvalid: boolean = false): boolean => {
  let acc = true;
  for (let i = 0; i < lineValidationRules.length; ++i) {
    const rule = lineValidationRules[i];
    acc = acc && rule.test(lineWords);
    if (throwOnInvalid && !acc) {
      throw new Error(`Rule violated: "${rule.name}".`);
    }
  }
  return acc;
};

/** Scans individual words and batches them up into commands. */
export class ModalStage implements InterpreterStage<WordBlock[], WordCollection> {
  public readonly name = 'Modal';

  public constructor () {}

  public async validate (words: WordBlock[]): Promise<boolean> { return validateLineWords(words); }

  public async processLineArtifacts (words: WordBlock[]): Promise<WordCollection> {
    const collection = new WordCollection();
    words.forEach((word: WordBlock): void => { collection.addWord(word); });
    return collection;
  }
}