import { InterpreterStage } from "../interpreterStage";
import { SegmentBlock, LineBlock } from '../../../parser/syntaxTree';


export class LineStage implements InterpreterStage<LineBlock, SegmentBlock[]> {
  public readonly name = 'Line';
  
  public constructor () {}

  public validate (): boolean { return true; }
  
  public processLineArtifacts (line: LineBlock): SegmentBlock[] {
    return line.segments;
  }
}