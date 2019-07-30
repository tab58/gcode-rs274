import {
  RealNumberBlock,
  ExpressionBlock,
  GetParameterValueBlock,
  UnaryOperationBlock,
  BinaryOperationBlock,
  ArcTangentBlock,
  RealValueBlock,
  TokenType
} from '../parser/syntaxTree';

// TODO: replace this with more numerically precise versions, if possible
const RAD_TO_DEG: number = 180 / Math.PI;
const DEG_TO_RAD: number = Math.PI / 180;

type UnaryFunction = (n: number) => number;
// TODO: replace these with more numerically precise versions, if they exist
const unaryFunctions: { [key: string]: UnaryFunction } = {
  abs: Math.abs,
  acos: (x: number): number => Math.acos(x) * RAD_TO_DEG,
  asin: (x: number): number => Math.asin(x) * RAD_TO_DEG,
  sin: (x: number): number => Math.sin(x * DEG_TO_RAD),
  cos: (x: number): number => Math.cos(x * DEG_TO_RAD),
  tan: (x: number): number => Math.tan(x * DEG_TO_RAD),
  exp: (x: number): number => Math.pow(Math.E, x),
  fix: Math.floor,
  fup: Math.ceil,
  ln: Math.log,
  round: Math.round,
  sqrt: Math.sqrt
};

type BinaryFunction = (a: number, b: number) => number;
const binaryFunctions: { [key: string]: BinaryFunction } = {
  "**": Math.pow,
  "/": (a: number, b: number): number => (a / b),
  "mod": (a: number, b: number): number => (a % b),
  "*": (a: number, b: number): number => (a * b),
  "-": (a: number, b: number): number => (a - b),
  "+": (a: number, b: number): number => (a + b),

  // TODO: replace these with 64-bit versions of bitwise operators
  "and": (a: number, b: number): number => (a & b),
  "xor": (a: number, b: number): number => (a ^ b),
  "or": (a: number, b: number): number => (a | b)
};

// TODO: replace this with more numerically precise versions, if possible
const atanFunction = (numerator: number, denominator: number): number => Math.atan(numerator / denominator) * RAD_TO_DEG;

/**
 * The contex
 */
export interface EvaluationContext {
  get: (param: number) => number;
  set: (param: number, value: number) => void;
}

/**
 * Evaluates nodes that eventually evaluate to a real-valued number.
 */
export function evaluateRealValueBlock<T extends RealValueBlock> (block: T, context: EvaluationContext): number {
  const type = block.type;
  switch (type) {
    case TokenType.RealNumber:
      return (block as RealNumberBlock).value;

    case TokenType.Expression:
      return evaluateRealValueBlock((block as ExpressionBlock).value, context);

    case TokenType.GetParameterValue:
      const { parameter } = (block as GetParameterValueBlock);
      const paramNumber = evaluateRealValueBlock(parameter, context);
      return context.get(paramNumber);

    case TokenType.OrdinaryUnaryCombo:
      const { operator: unaryOperator, expression } = (block as UnaryOperationBlock);
      const unaryOp = unaryFunctions[unaryOperator];
      return unaryOp(evaluateRealValueBlock(expression, context));

    case TokenType.BinaryOperation:
      const { operator: binaryOperator, leftValue, rightValue } = (block as BinaryOperationBlock);
      const a = evaluateRealValueBlock(leftValue, context);
      const b = evaluateRealValueBlock(rightValue, context);
      const binaryOp = binaryFunctions[binaryOperator.operator];
      return binaryOp(a, b);

    case TokenType.ArcTangentCombo:
      const { numeratorExpr, denominatorExpr } = (block as ArcTangentBlock);
      const num = evaluateRealValueBlock(numeratorExpr, context);
      const den = evaluateRealValueBlock(denominatorExpr, context);
      return atanFunction(num, den);
  }
}