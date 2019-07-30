import { WordBlock, CommandBlock } from '../interpreter/types';

export enum SelectionQuantifier {
  AtLeastOneOf,
  AllOf
}

export function containsWordAddresses (cmd: CommandBlock, addresses: string[], quant: SelectionQuantifier): boolean {
  if (quant === SelectionQuantifier.AllOf) {
    // all addresses must match
    return addresses.reduce((acc: boolean, address: string): boolean => {
      // determine if there's a match
      return acc && cmd.reduceWords((acc1: boolean, word: WordBlock): boolean => {
        return (acc1 || (word.code === address));
      }, false);
    }, true);
  } else if (quant === SelectionQuantifier.AtLeastOneOf) {
    return addresses.reduce((acc: boolean, address: string): boolean => {
      // determine if there's a match
      return acc || cmd.reduceWords((acc1: boolean, word: WordBlock): boolean => {
        return (acc1 || (word.code === address));
      }, false);
    }, false);
  } else {
    console.warn(`Quantifier ${quant} is illegal.`);
    return false;
  }
}

export const gCodeValidators = {
  0: (command: CommandBlock): boolean => containsWordAddresses(command, ['A', 'B', 'C', 'X', 'Y', 'Z'], SelectionQuantifier.AtLeastOneOf),
  1: (command: CommandBlock): boolean => containsWordAddresses(command, ['A', 'B', 'C', 'X', 'Y', 'Z'], SelectionQuantifier.AtLeastOneOf),
  2: (command: CommandBlock): boolean => containsWordAddresses(command, ['A', 'B', 'C', 'X', 'Y', 'Z'], SelectionQuantifier.AtLeastOneOf)
};