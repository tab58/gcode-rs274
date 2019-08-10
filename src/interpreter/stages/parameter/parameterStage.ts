import { defaultParameters } from './defaultParameters';
import { MidlineWordBlock, SegmentBlock, SetParameterValueBlock, TokenType } from '../../../parser/syntaxTree';
import { InterpreterStage } from "../interpreterStage";
import { WordBlock } from "../../types";
import { evaluateRealValueBlock, EvaluationContext } from './evaluateRealValueBlock';

/** Provides a table from RS274 parameter values. */
class ParameterTable implements EvaluationContext {
  private _parameterTable: { [key: string]: number };

  public constructor (parameters: { [key: string]: number } = defaultParameters) {
    this._parameterTable = Object.assign({}, parameters);
  }

  public get (param: number): number {
    return this._parameterTable[param];
  }

  public set (param: number, value: number): void {
    this._parameterTable[param] = value;
  }

  public clone (): ParameterTable {
    const newStore = Object.assign({}, this._parameterTable);
    const table = new ParameterTable(newStore);
    return table;
  }
}

/** Interprets segments into RS274-compliant words by evaluating parameter values. */
export class ParameterStage implements InterpreterStage<SegmentBlock[], WordBlock[]> {
  public readonly name = 'Parameter';
  
  /** The parameter store. */
  private _parameterTable: ParameterTable;

  public getParameterTable (): ParameterTable { return this._parameterTable.clone(); }
  public constructor (table?: { [key: string]: number }) {
    this._parameterTable = new ParameterTable(table);
  }

  public async validate (): Promise<boolean> { return true; }
  public async processLineArtifacts (segments: SegmentBlock[]): Promise<WordBlock[]> {
    // evaluate the segment expressions and build RS274-compliant words.
    const words: WordBlock[] = (segments.filter((segment): boolean => segment.isType(TokenType.MidlineWord)) as MidlineWordBlock[])
      .map((word: MidlineWordBlock): WordBlock => {
        const evaledValue = evaluateRealValueBlock(word.value, this._parameterTable);
        return new WordBlock(word.code, evaledValue);
      });

    // change the parameter values after the numbers has been evaluated.
    (segments.filter((segment): boolean => segment.isType(TokenType.SetParameterValue)) as SetParameterValueBlock[])
      .forEach((setParamValue: SetParameterValueBlock): void => {
        const param = evaluateRealValueBlock(setParamValue.parameter, this._parameterTable);
        const value = evaluateRealValueBlock(setParamValue.value, this._parameterTable);
        this._parameterTable.set(param, value);
      });
    return words;
  }
}