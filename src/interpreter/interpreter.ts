import { LineBlock } from '../parser/syntaxTree';
import { CommandBlock } from './types';
import { InterpreterStage } from './stages/interpreterStage';

import { ParameterStage } from './stages/parameter/parameterStage';
import { LineStage } from './stages/line/lineStage';
import { ModalStage } from './stages/modal/modalStage';
import { CommandStage } from './stages/command/commandStage';

/**
 * Builds the commands for RS274 code. Contains set parameter values for real number evaluation.
 */
export class RS274Interpreter {
  /** A collection of stages for the interpreter. */
  private _stages: InterpreterStage<any, any>[];

  public constructor (table?: { [key: string]: number }) {
    const lineStage = new LineStage();
    const parameterStage = new ParameterStage(table);
    const modalStage = new ModalStage();
    const commandStage = new CommandStage();

    this._stages = [
      lineStage,
      parameterStage,
      modalStage,
      commandStage
    ];
  }

  /**
   * Interprets a RS274 line.
   * @param lineAST The abstract syntax tree for the line.
   */
  public async readLine (lineAST: LineBlock): Promise<CommandBlock[]> {
    let artifact = lineAST;
    for (let i = 0; i < this._stages.length; ++i) {
      const stage = this._stages[i];
      try {
        await stage.validate(artifact);
        artifact = await stage.processLineArtifacts(artifact);
      } catch (e) {
        throw e;
      }
    }
    return (artifact as any);
  }
}