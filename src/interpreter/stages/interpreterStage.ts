export interface InterpreterStage<T1, T2> {
  /** The name of the stage. */
  name: string;
  /** Validates the output of the previous stage. */
  validate: (t1: T1) => boolean;
  /** Converts the output of the previous stage to the input of the next stage. */
  processLineArtifacts: (t1: T1) => T2;
}