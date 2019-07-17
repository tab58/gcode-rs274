import { joinElementText, ifBlankTreeNodeSetNull, isBlankTreeNode, isTreeNode } from './utils';
import {
  BinaryOperatorBlock,
  TokenType,
  RealValueBlock,
  BinaryOperationBlock,
  LineBlock,
  LineNumberBlock,
  RealNumberBlock,
  PartialBinaryOperationBlock,
  MidlineWordBlock,
  ExpressionBlock,
  GetParameterValueBlock,
  UnaryOperationBlock,
  ArcTangentBlock,
  SetParameterValueBlock,
  CommentBlock,
  MessageBlock,
  BlockDeleteBlock
} from './syntaxTree';
import { TreeNode } from './rs274';

function _makeBinaryOperator (operator: string): BinaryOperatorBlock {
  let precedence;
  switch (operator) {
    case "**":
      precedence = 0;
      break;
    case "/":
    case "mod":
    case "*":
      precedence = 1;
      break;
    case "and":
    case "xor":
    case "-":
    case "or":
    case "+":
      precedence = 2;
      break;
    default:
      throw new Error(`Undefined binary operation: "${operator}".`);
  }
  return new BinaryOperatorBlock(operator, precedence);
}

function _makeBinaryOperationNode (operator: BinaryOperatorBlock, leftValue: RealValueBlock, rightValue: RealValueBlock): BinaryOperationBlock {
  return new BinaryOperationBlock(operator, leftValue, rightValue);
}

function _buildExpressionTree (expressionElements: any): any {
  const [, lhsRealValue, binOpComboNode ] = expressionElements;
  // get the "binary_operation_combo" objects
  const binOpNodes: any[] = (!binOpComboNode || isBlankTreeNode(binOpComboNode))
    ? null
    : binOpComboNode.elements;

  // if no binary ops, just return the real value
  if (!binOpNodes || binOpNodes.length === 0) { return lhsRealValue; }

  const values: RealValueBlock[] = [ lhsRealValue ];
  const operators: BinaryOperatorBlock[] = [];
  const opPrecedences: number[] = [];
  for (let i = 0; i < binOpNodes.length; ++i) {
    const binOpNode = binOpNodes[i];
    if (binOpNode.type && binOpNode.type === TokenType.PartialBinaryOperation) {
      const { operator: binOp, value: realValue } = binOpNode as PartialBinaryOperationBlock;
      // Workaround: for some binary operators like "-", it doesn't quite lex correctly and doesn't always make an operator struct.
      const op = isTreeNode(binOp) ? _makeBinaryOperator((binOp as any).text) : binOp;
      values.push(realValue);
      operators.push(op);
      opPrecedences.push(op.precedence);
    } else {
      throw new Error('Expecting a PartialBinaryOperationBlock.');
    }
  }
  const traversalOrder = opPrecedences.slice().fill(0);

  let idxCounter = 0;
  [0,1,2].forEach((order: number): void => {
    opPrecedences.forEach((precedence: number, opIndex: number): void => {
      if (precedence === order) {
        traversalOrder[opIndex] = idxCounter++;
      }
    });
  });
  
  const firstIdx = traversalOrder.indexOf(0);
  if (firstIdx === -1) { throw new Error('Big problem: nothing to traverse.'); }
  let leftNode: RealValueBlock = values.splice(firstIdx, 1)[0];
  for (let i = 0; i < traversalOrder.length; ++i) {
    const travIdx = traversalOrder.indexOf(i);
    const op = operators[travIdx];
    const value = values[travIdx];
    leftNode = _makeBinaryOperationNode(op, leftNode, value);
  }
  return leftNode;
}

function makeLine (_input: string, _start: number, _end: number, elements: any[]): LineBlock {
  const [blockDelNode, lineNumNode, segmentNode] = elements.map(ifBlankTreeNodeSetNull);
  const blockDelete = (!blockDelNode || isBlankTreeNode(blockDelNode)) ? null : new BlockDeleteBlock();

  const segmentElements = segmentNode && segmentNode.elements ? segmentNode.elements : [];
  return new LineBlock(blockDelete, lineNumNode, ...segmentElements);
}

function makeLineNumber (_input: string, _start: number, _end: number, elements: any[]): LineNumberBlock {
  // line_number <- letter_n digit digit? digit? digit? digit?
  const [, ...digits] = elements;
  const text = joinElementText(digits);
  return new LineNumberBlock(Number.parseInt(text));
}

function makeMidLineWord (_input: string, _start: number, _end: number, elements: any[]): MidlineWordBlock {
  // mid_line_word <- mid_line_letter real_value
  const [ letterNode, realValueNode ] = elements;
  const code = (letterNode as TreeNode).text.toUpperCase();
  return new MidlineWordBlock(code, realValueNode);
}

function makeRealNumber (_input: string, _start: number, _end: number, elements: any[]): RealNumberBlock {
  // real_number <- ( "+" / "-" )? ( (digit ( digit )* (".")? ( digit )*) / ("." digit ( digit )*) )
  const text = joinElementText(elements);
  return new RealNumberBlock(Number.parseFloat(text));
}

function makeExpression (_input: string, _start: number, _end: number, elements: any[]): ExpressionBlock {
  // expression <- "[" real_value ( binary_operation_combo )* "]"
  const expressionNode = _buildExpressionTree(elements);
  return new ExpressionBlock(expressionNode);
}

function makeGetParameterValue (_input: string, _start: number, _end: number, elements: any[]): GetParameterValueBlock {
  // parameter_value <- "#" real_value
  const [, parameterValue ] = elements;
  return new GetParameterValueBlock(parameterValue);
}

function makeOrdinaryUnaryCombo (_input: string, _start: number, _end: number, elements: any[]): UnaryOperationBlock {
  // ordinary_unary_combo <- ordinary_unary_operation expression
  const [ operationNode, exprNode ] = elements;
  return new UnaryOperationBlock(operationNode.text, exprNode);
}

function makeArcTangentCombo (_input: string, _start: number, _end: number, elements: any[]): ArcTangentBlock {
  // arc_tangent_combo <- "atan" expression "/" expression
  const [, exprNode1, , exprNode2 ] = elements;
  return new ArcTangentBlock(exprNode1, exprNode2);
}

function makeBinaryOperationCombo (_input: string, _start: number, _end: number, elements: any[]): PartialBinaryOperationBlock {
  // binary_operation_combo <- ( binary_operation1 / binary_operation2 / binary_operation3 ) real_value
  const [ binOpNode, realValueNode ] = elements;
  return new PartialBinaryOperationBlock(binOpNode, realValueNode);
}

function makeBinOp (input: string, start: number, end: number): BinaryOperatorBlock {
  return _makeBinaryOperator(input.substring(start, end));
}

function makeSetParameterValue (_input: string, _start: number, _end: number, elements: any[]): SetParameterValueBlock {
  const [ , paramRealValueNode, , valueRealValueNode ] = elements;
  return new SetParameterValueBlock(paramRealValueNode, valueRealValueNode);
}

function makeMessage (_input: string, _start: number, _end: number, elements: any[]): MessageBlock {
  const chars = elements.slice(9);
  const text = joinElementText(chars);
  return new MessageBlock(text);
}

function makeComment (_input: string, _start: number, _end: number, elements: any[]): CommentBlock {
  const chars = elements.slice(1, -1);
  const text = joinElementText(chars);
  return new CommentBlock(text);
}

export const actions = {
  makeLine,
  makeLineNumber,
  makeMidLineWord,
  makeRealNumber,
  makeExpression,
  makeGetParameterValue,
  makeOrdinaryUnaryCombo,
  makeArcTangentCombo,
  makeBinaryOperationCombo,
  makeBinOp,
  makeSetParameterValue,
  makeComment,
  makeMessage
};