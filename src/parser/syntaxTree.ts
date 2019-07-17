export enum TokenType {
  BlockDelete = 'block_delete',
  Line = 'line',
  LineNumber = 'line_number',
  Segment = "segment",
  MidlineWord = 'mid_line_word',
  Text = 'text',
  Expression = 'expression',
  RealNumber = 'real_number',
  GetParameterValue = 'get_parameter_value',
  OrdinaryUnaryCombo = 'ordinary_unary_combo',
  ArcTangentCombo = 'arc_tangent_combo',
  SetParameterValue = 'set_parameter_value',
  PartialBinaryOperation = 'partial_binary_operation',
  BinaryOperation = 'binary_operation',
  BinaryOperator = 'binary_operator',
  Comment = 'comment',
  Message = "message"
}

class LexerBlock {
  public readonly type: TokenType;

  public constructor (type: TokenType) {
    this.type = type;
  }

  public isType (type: TokenType): boolean {
    return (this.type === type);
  }
}

/**
 * A block that signifies a block delete (i.e. bypassing interpretation of this line).
 */
export class BlockDeleteBlock extends LexerBlock {
  public readonly value: boolean;

  public constructor (value: boolean = true) {
    super(TokenType.BlockDelete);
    this.value = value;
  }
}

export class LineNumberBlock extends LexerBlock {
  public readonly line: number;

  public constructor (line: number) {
    super(TokenType.LineNumber);
    this.line = line;
  }
}

/**
 * Block representing the syntax tree for a line.
 */
export class LineBlock extends LexerBlock {
  public readonly blockDelete: BlockDeleteBlock;
  public get lineNumber (): LineNumberBlock { return this._lineNumber; }
  private _lineNumber: LineNumberBlock;
  public readonly segments: SegmentBlock[];

  public constructor (blockDelete: BlockDeleteBlock, lineNumber: LineNumberBlock, ...segments: SegmentBlock[]) {
    super(TokenType.Line);
    this.blockDelete = blockDelete;
    this._lineNumber = lineNumber;
    this.segments = segments;
  }

  public setLineNumber (lineNumber: number): void {
    this._lineNumber = new LineNumberBlock(lineNumber);
  }
}

export type SegmentBlock = MidlineWordBlock | CommentBlock | SetParameterValueBlock;

export class MidlineWordBlock extends LexerBlock {
  public readonly code: string;
  public readonly value: RealValueBlock;

  public constructor (code: string, value: RealValueBlock) {
    super(TokenType.MidlineWord);
    this.code = code;
    this.value = value;
  }
}

export type RealValueBlock = RealNumberBlock | ExpressionBlock | GetParameterValueBlock | UnaryOperationBlock | BinaryOperationBlock | ArcTangentBlock;

export class RealNumberBlock extends LexerBlock {
  public readonly value: number;

  public constructor (value: number) {
    super(TokenType.RealNumber);
    this.value = value;
  }
}

export class ExpressionBlock extends LexerBlock {
  public readonly value: RealValueBlock;

  public constructor (value: RealNumberBlock) {
    super(TokenType.Expression);
    this.value = value;
  }
}

export class GetParameterValueBlock extends LexerBlock {
  /** Parameter must evaluate to integer from 1-5399. */
  public readonly parameter: RealValueBlock;

  public constructor (parameter: RealValueBlock) {
    super(TokenType.GetParameterValue);
    this.parameter = parameter;
  }
}

export class UnaryOperationBlock extends LexerBlock {
  /** Operator: "abs", "acos", "asin", "cos", "exp", "fix", "fup", "ln", "round", "sin", "sqrt", "tan" */
  public readonly operator: string;
  public readonly expression: ExpressionBlock;

  public constructor (operator: string, expression: ExpressionBlock) {
    super(TokenType.OrdinaryUnaryCombo);
    this.operator = operator;
    this.expression = expression;
  }
}

export class ArcTangentBlock extends LexerBlock {
  public readonly numeratorExpr: ExpressionBlock;
  public readonly denominatorExpr: ExpressionBlock;

  public constructor (numeratorExpr: ExpressionBlock, denominatorExpr: ExpressionBlock) {
    super(TokenType.ArcTangentCombo);
    this.numeratorExpr = numeratorExpr;
    this.denominatorExpr = denominatorExpr;
  }
}

export class BinaryOperationBlock extends LexerBlock {
  public readonly operator: BinaryOperatorBlock;
  public readonly leftValue: RealValueBlock;
  public readonly rightValue: RealValueBlock;

  public constructor (operator: BinaryOperatorBlock, leftValue: RealValueBlock, rightValue: RealValueBlock) {
    super(TokenType.BinaryOperation);
    this.operator = operator;
    this.leftValue = leftValue;
    this.rightValue = rightValue;
  }
}

export class PartialBinaryOperationBlock extends LexerBlock {
  public readonly operator: BinaryOperatorBlock;
  public readonly value: RealValueBlock;

  public constructor (operator: BinaryOperatorBlock, value: RealValueBlock) {
    super(TokenType.PartialBinaryOperation);
    this.operator = operator;
    this.value = value;
  }
}

export class BinaryOperatorBlock extends LexerBlock {
  public readonly operator: string;
  /** Precedence is 0-2, where 0 is processed before 1, and 1 is processed before 2. */
  public readonly precedence: number;

  public constructor (operator: string, precedence: number) {
    super(TokenType.BinaryOperator);
    this.operator = operator;
    this.precedence = precedence;
  }
}

export class SetParameterValueBlock extends LexerBlock {
  public readonly parameter: RealValueBlock;
  public readonly value: RealValueBlock;

  public constructor (parameter: RealValueBlock, value: RealValueBlock) {
    super(TokenType.SetParameterValue);
    this.parameter = parameter;
    this.value = value;
  }
}

export class CommentBlock extends LexerBlock {
  public readonly comment: string;

  public constructor (comment: string) {
    super(TokenType.Comment);
    this.comment = comment;
  }
}

export class MessageBlock extends LexerBlock {
  public readonly message: string;

  public constructor (message: string) {
    super(TokenType.Message);
    this.message = message;
  }
}