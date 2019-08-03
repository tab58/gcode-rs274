import { CommandBlock } from '../../types';

const addWords = (words: string[], command: CommandBlock, wordMap: { [key: string]: number }): CommandBlock => {
  words.forEach((code: string): void => {
    const value = wordMap[code];
    command.addWordByParts(code, value);
  });
  return command;
};

export const commandBuilders: { [key: string]: { [key: string]: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }) => CommandBlock } } = {
  G: {
    0: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z'], new CommandBlock(commandWord), wordMap);
    },
    1: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z', 'F'], new CommandBlock(commandWord), wordMap);
    },
    2: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z', 'R', 'I', 'J', 'K', 'F'], new CommandBlock(commandWord), wordMap);
    },
    3: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z', 'R', 'I', 'J', 'K', 'F'], new CommandBlock(commandWord), wordMap);
    },
    4: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['P'], new CommandBlock(commandWord), wordMap);
    },
    10: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z', 'L', 'P'], new CommandBlock(commandWord), wordMap);
    },
    17: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    18: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    19: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    20: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    21: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    28: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z'], new CommandBlock(commandWord), wordMap);
    },
    30: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z'], new CommandBlock(commandWord), wordMap);
    },
    38.2: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z'], new CommandBlock(commandWord), wordMap);
    },
    40: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['D'], new CommandBlock(commandWord), wordMap);
    },
    41: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['D'], new CommandBlock(commandWord), wordMap);
    },
    42: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['D'], new CommandBlock(commandWord), wordMap);
    },
    43: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['H'], new CommandBlock(commandWord), wordMap);
    },
    49: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['H'], new CommandBlock(commandWord), wordMap);
    },
    53: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z'], new CommandBlock(commandWord), wordMap);
    },
    54: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    55: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    56: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    57: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    58: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    59: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    59.1: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    59.2: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    59.3: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    61: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    61.1: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    64: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    80: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    81: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z', 'R', 'L'], new CommandBlock(commandWord), wordMap);
    },
    82: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z', 'R', 'L', 'P'], new CommandBlock(commandWord), wordMap);
    },
    83: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z', 'R', 'L', 'Q'], new CommandBlock(commandWord), wordMap);
    },
    84: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z', 'R', 'L'], new CommandBlock(commandWord), wordMap);
    },
    85: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z', 'R', 'L'], new CommandBlock(commandWord), wordMap);
    },
    86: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z', 'R', 'L', 'P'], new CommandBlock(commandWord), wordMap);
    },
    87: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z', 'R', 'L', 'I', 'J', 'K'], new CommandBlock(commandWord), wordMap);
    },
    88: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z', 'R', 'L', 'P'], new CommandBlock(commandWord), wordMap);
    },
    89: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z', 'R', 'L', 'P'], new CommandBlock(commandWord), wordMap);
    },
    90: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    91: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    92: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z'], new CommandBlock(commandWord), wordMap);
    },
    92.1: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z'], new CommandBlock(commandWord), wordMap);
    },
    92.2: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z'], new CommandBlock(commandWord), wordMap);
    },
    92.3: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['A', 'B', 'C', 'X', 'Y', 'Z'], new CommandBlock(commandWord), wordMap);
    },
    93: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['F'], new CommandBlock(commandWord), wordMap);
    },
    94: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['F'], new CommandBlock(commandWord), wordMap);
    },
    98: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    99: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
  },
  M: {
    0: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    1: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    2: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    3: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    4: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    5: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    6: (commandWord: { code: string; value: number }, wordMap: { [key: string]: number }): CommandBlock => {
      return addWords(['T'], new CommandBlock(commandWord), wordMap);
    },
    7: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    8: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    9: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    30: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    },
    60: (commandWord: { code: string; value: number }): CommandBlock => {
      return new CommandBlock(commandWord);
    }
  }
};