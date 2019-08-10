import { RS274Interpreter } from './interpreter/interpreter';
import { parseLine } from './parser/parser';
import { CommandBlock } from './interpreter/types';

export { RS274Interpreter as RS274Interpreter };

/**
 * Parses a string that has 1 or more whole lines that conform to RS274 specifications.
 * @param program The RS274NGC code in string form. Can handle individual lines, multiline strings, and string arrays.
 * @param interpreter The command builder state machine.
 */
export const parse = async function* (program: string | string[], interpreter: RS274Interpreter = new RS274Interpreter()): AsyncIterableIterator<CommandBlock> {
  const lines = Array.isArray(program) ? program : program.split('\n');
  for (const line of lines) {
    const ast = parseLine(line);
    
    const commands = await interpreter.readLine(ast);
    for (const command of commands) {
      yield command;
    }
  }
};