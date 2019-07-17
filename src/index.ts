import { RS274Interpreter } from './interpreter/interpreter';
import { parseLine } from './parser/parser';
import { CommandBlock } from './interpreter/types';

export { RS274Interpreter };

/**
 * Parses a string that has 1 or more whole lines that conform to RS274NGC specifications.
 * @param program The RS274NGC code in string form.
 * @param interpreter The interpreter state machine.
 */
export const parse = function* (program: string, interpreter: RS274Interpreter = new RS274Interpreter()): IterableIterator<CommandBlock> {
  const lines = program.split('\n');
  for (const line of lines) {
    const ast = parseLine(line);
    const commands = interpreter.readLine(ast);
    for (const command of commands) {
      yield command;
    }
  }
};