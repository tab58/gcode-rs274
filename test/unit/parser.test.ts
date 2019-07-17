import { expect } from 'chai';

import { parseLine } from '../../src/parser/parser';
import { ExpressionBlock } from '../../src/parser/syntaxTree';

describe('Testing parser actions', (): void => {
  describe('Line Structure', (): void => {
    it('should parse block deletes', (): void => {
      const line = '/N00001G3X0.5Y0.5(hello world)Z0.5\n';
      const { blockDelete } = parseLine(line);
      expect(blockDelete).to.not.be.undefined;
      expect(blockDelete.value).to.be.true;
    });
    it('should parse line numbers', (): void => {
      const line = '/N00001G3X0.5Y0.5(hello world)Z0.5';
      const { lineNumber } = parseLine(line);
      expect(lineNumber.line).to.be.equal(1);

      const line2 = '/G3X0.5Y0.5(hello world)Z0.5';
      const parsed: any = parseLine(line2);
      const { lineNumber: lineNo2 } = parsed;
      // console.log(parsed);
      expect(lineNo2).to.be.null;
    });
  });
  describe('Block Tests', (): void => {
    it('should parse pure unary expressions', (): void => {
      const line = 'G3X[ln[cos[3]]]';
      debugger;
      const parsed = parseLine(line);
      const exprNode = (parsed.segments[1] as ExpressionBlock).value;
      const expected = {
        "type": "expression",
        "value": {
          "type": "ordinary_unary_combo",
          "operator": "ln",
          "expression": {
            "type": "expression",
            "value": {
              "type": "ordinary_unary_combo",
              "operator": "cos",
              "expression": {
                "type": "expression",
                "value": {
                  "type": "real_number",
                  "value": 3
                }
              }
            }
          }
        }
      };
      expect(exprNode).to.be.deep.equal(expected);
    });
    it('should parse pure binary expressions', (): void => {
      const line = 'G3X[2+3/5-7*9]';
      debugger;
      const parsed: any = parseLine(line);
      const exprNode = parsed.segments[1].value;
      const expected = {
        "type": "expression",
        "value": {
          "leftValue": {
            "leftValue": {
              "leftValue": {
                "leftValue": {
                  "type": "real_number",
                  "value": 3
                },
                "operator": {
                  "operator": "/",
                  "precedence": 1,
                  "type": "binary_operator"
                },
                "rightValue": {
                  "type": "real_number",
                  "value": 5
                },
                "type": "binary_operation"
              },
              "operator": {
                "operator": "*",
                "precedence": 1,
                "type": "binary_operator"
              },
              "rightValue": {
                "type": "real_number",
                "value": 9
              },
              "type": "binary_operation"
            },
            "operator": {
              "operator": "+",
              "precedence": 2,
              "type": "binary_operator"
            },
            "rightValue": {
              "type": "real_number",
              "value": 2
            },
            "type": "binary_operation"
          },
          "operator": {
            "operator": "-",
            "precedence": 2,
            "type": "binary_operator"
          },
          "rightValue": {
            "type": "real_number",
            "value": 7
          },
          "type": "binary_operation"
        }
      };
      expect(exprNode).to.be.deep.equal(expected);
    });
  });
});