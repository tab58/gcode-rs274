import { expect } from 'chai';

import { parseLine } from '../../src/rs274/parser/parser';
import { evaluateRealValueBlock } from '../../src/rs274/interpreter/evaluate/expression';

import INPUT_LINES from './input.json';
import EXPECTED_LINES from './expected.json';
import { SegmentBlock } from 'parser/types';

describe('Testing parser actions', (): void => {
  it('should pass the sample file', (): void => {
    const len = INPUT_LINES.length;
    for (let i = 0; i < len; ++i) {
      const line = INPUT_LINES[i];
      const parsed = parseLine(line);

      const expected = EXPECTED_LINES[i];
      const valueNames = Object.keys(expected);
      valueNames.forEach((valueName: string): void => {
        const value = (expected as any)[valueName];
        if (valueName === 'n') {
          // expect(parsed.lineNumber.line).to.be.equal(value);
        } else if (valueName === 'x') {
          // if (Number.parseInt(value) === value) {
          //   // value is integer
          //   const xSegment = parsed.segments.filter((segment): boolean => segment.code === 'X')[0];
          //   const xValue = evaluateRealValueBlock(xSegment.value);
          //   expect().to.be.equal(value);
          // } else {
          //   // value is real
          // }
        }
      });
    }
  });
});