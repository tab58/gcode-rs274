import { expect } from 'chai';

import { parseLine } from '../../src/parser/parser';
import { RS274Interpreter } from '../../src/interpreter/interpreter';

describe('Interpreter Tests', (): void => {
  describe('Command Interpretation', (): void => {
    let interpreter: RS274Interpreter;
    beforeEach((): void => {
      interpreter = new RS274Interpreter();
    });
    it('should break line into a single command', (): void => {
      const line = 'G0X0.12345Y-.55F200';
      const ast = parseLine(line);
      const commands = interpreter.readLine(ast);
      expect(commands.length).to.be.equal(2);
      const [ fCommand, gCommand ] = commands;
      expect(gCommand.command.code).to.be.equal('G');
      expect(gCommand.command.value).to.be.equal(0);
      expect(gCommand.getWordValue('X')).to.be.equal(0.12345);
      expect(gCommand.getWordValue('Y')).to.be.equal(-0.55);
      expect(fCommand.command.code).to.be.equal('F');
      expect(fCommand.command.value).to.be.equal(200);
    });
    it('should error when bad command code is passed', (): void => {
      const line = 'G12G0X0.12345Y-.55F200';
      const ast = parseLine(line);
      const badFn = (): any => interpreter.readLine(ast);
      expect(badFn).to.throw('Word not recognized: "G12".');
    });
  });
  describe('Expression Evaluation', (): void => {
    let interpreter: RS274Interpreter;
    beforeEach((): void => {
      interpreter = new RS274Interpreter();
    });
    it('should evaluate real numbers', (): void => {
      const line = 'G0X0.12345';
      const ast = parseLine(line);
      const [ command ] = interpreter.readLine(ast);
      expect(command.command.code).to.be.equal('G');
      expect(command.command.value).to.be.equal(0);
      expect(command.getWordValue('X')).to.be.equal(0.12345);
    });
    it('should evaluate pure unary expressions', (): void => {
      const line = 'G0X[cos[90]]';
      const ast = parseLine(line);
      const [ command ] = interpreter.readLine(ast);
      expect(command.command.code).to.be.equal('G');
      expect(command.command.value).to.be.equal(0);
      expect(command.getWordValue('X') - 0).to.be.lessThan(1e-4);
    });
    it('should evaluate pure binary expressions', (): void => {
      const line = 'G0X[90+4/2]';
      const ast = parseLine(line);
      const [ command ] = interpreter.readLine(ast);
      expect(command.command.code).to.be.equal('G');
      expect(command.command.value).to.be.equal(0);
      expect(command.getWordValue('X')).to.be.equal(92);
    });
    it('should evaluate mixed expressions', (): void => {
      const line = 'G0X[cos[43+4/2]-sin[0]]';
      const ast = parseLine(line);
      const [ command ] = interpreter.readLine(ast);
      expect(command.command.code).to.be.equal('G');
      expect(command.command.value).to.be.equal(0);
      expect(command.getWordValue('X') - 0.7071).to.be.lessThan(1e-4);
    });
  });
});