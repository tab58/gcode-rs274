import { evaluateRealValueBlock } from '../../evaluate/expression';
import { MidlineWordBlock } from '../../parser/types';



const gBlockValidator = {
  0: (block: MidlineWordBlock): boolean => {

  },
  1: (block: MidlineWordBlock): boolean => {

  },
  2: (block: MidlineWordBlock): boolean => {

  },
  3: (block: MidlineWordBlock): boolean => {

  },
  10: (block: MidlineWordBlock): boolean => {

  },
  20: (block: MidlineWordBlock): boolean => {

  },
  21: (block: MidlineWordBlock): boolean => {

  },
  90: (block: MidlineWordBlock): boolean => {

  },
  91: (block: MidlineWordBlock): boolean => {

  }
};

export function isValidGBlock (segments: MidlineWordBlock[]): boolean {
  const { code, value } = segments[0];
  const isG = (code === 'G');
  const gCodeNum = Math.round(evaluateRealValueBlock(value));
  return (isG && gBlockValidator[gCodeNum])
}