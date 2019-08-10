import { InterpreterStage } from "../interpreterStage";
import { SegmentBlock, LineBlock } from '../../../parser/syntaxTree';


export class LineStage implements InterpreterStage<LineBlock, SegmentBlock[]> {
  public readonly name = 'Line';
  
  public constructor () {}

  public async validate (): Promise<boolean> { return true; }
  
  public async processLineArtifacts (line: LineBlock): Promise<SegmentBlock[]> {
    return line.segments;
  }
}