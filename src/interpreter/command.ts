import {
  ModalGroup,
  modalCodes,
  nonModalCodes,
  getModalGroupName,
  getNonmodalGroupName
} from './modals';

export const getCommandGroupName = (code: string, value: number): string => {
  return getModalGroupName(code, value) || getNonmodalGroupName(code, value);
};

// the concept of words that belong to command words is here

const getGroupNameForNonCommandWord = (modalStore: { [key: string]: ModalGroup }, code: string): string => {
  return Object.keys(modalStore).reduce((acc: string, modalGroupName: string): string => {
    const modalGroup = modalStore[modalGroupName];
    const { words } = modalGroup;
    return words.includes(code)
      ? modalGroupName
      : acc;
  }, undefined);
};

export const getModalGroupNameForNonCommandWord = getGroupNameForNonCommandWord.bind(null, modalCodes);

export const getNonModalGroupNameForNonCommandWord = getGroupNameForNonCommandWord.bind(null, nonModalCodes);

export const getCommandGroupNameForNonCommandWord = (code: string): string => {
  return getModalGroupNameForNonCommandWord(code) || getNonModalGroupNameForNonCommandWord(code);
};