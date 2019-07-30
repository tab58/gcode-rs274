import { expect } from 'chai';

import { parseLine } from '../../src/parser/parser';
import { TokenType, RealNumberBlock } from '../../src/parser/syntaxTree';
import { ExpressionBlock, MidlineWordBlock, CommentBlock, SetParameterValueBlock } from '../../src/parser/syntaxTree';

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
      expect(lineNo2).to.be.null;
    });
  });
  describe('Block Tests', (): void => {
    it('should parse pure unary expressions', (): void => {
      const line = 'G3X[ln[cos[3]]]';
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
      const parsed = parseLine(line);
      const { value: exprNode } = parsed.segments[1] as MidlineWordBlock;
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
    it('should parse comments', (): void => {
      const commentText = 'hello';
      const line = `G3X[2+3/5-7*9](${commentText})`;
      const parsed = parseLine(line);
      const { comment } = parsed.segments[2] as CommentBlock;
      expect(comment).to.be.equal(commentText);
    });
    it('should parse a set parameter command', (): void => {
      const param = 1356;
      const pValue = 34;
      const line = `G3X[2+3/5-7*9]#${param}=${pValue}`;
      const parsed = parseLine(line);
      const { parameter, value } = parsed.segments[2] as SetParameterValueBlock;
      expect(parameter.type).to.be.equal(TokenType.RealNumber);
      expect((parameter as RealNumberBlock).value).to.be.equal(param);
      expect(value.type).to.be.equal(TokenType.RealNumber);
      expect((value as RealNumberBlock).value).to.be.equal(pValue);
    });
  });
});