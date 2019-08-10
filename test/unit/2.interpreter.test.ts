import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised as any);

import { parseLine } from '../../src/parser/parser';
import { RS274Interpreter } from '../../src/interpreter/interpreter';

describe('Interpreter Tests', (): void => {
  describe('Command Interpretation', (): void => {
    let interpreter: RS274Interpreter;
    beforeEach((): void => {
      interpreter = new RS274Interpreter();
    });
    it('should break line into a single command', async (): Promise<void> => {
      const line = 'G1X0.12345Y-.55F200';
      const ast = parseLine(line);
      const commands = await interpreter.readLine(ast);
      expect(commands.length).to.be.equal(1);
      const [ gCommand ] = commands;
      expect(gCommand.command.code).to.be.equal('G');
      expect(gCommand.command.value).to.be.equal(1);
      expect(gCommand.getWordValue('X')).to.be.equal(0.12345);
      expect(gCommand.getWordValue('Y')).to.be.equal(-0.55);
      expect(gCommand.getWordValue('F')).to.be.equal(200);
    });
    it('should error when bad command code is passed', async (): Promise<void> => {
      const line = 'G12G0X0.12345Y-.55F200';
      const ast = parseLine(line);
      const badFn = async (): Promise<any> => await interpreter.readLine(ast);
      expect(badFn()).to.be.eventually.rejectedWith('Invalid command word: "G12".');
    });
  });
  describe('Expression Evaluation', (): void => {
    let interpreter: RS274Interpreter;
    beforeEach((): void => {
      interpreter = new RS274Interpreter();
    });
    it('should evaluate real numbers', async (): Promise<void> => {
      const line = 'G0X0.12345';
      const ast = parseLine(line);
      const [ command ] = await interpreter.readLine(ast);
      expect(command.command.code).to.be.equal('G');
      expect(command.command.value).to.be.equal(0);
      expect(command.getWordValue('X')).to.be.equal(0.12345);
    });
    it('should evaluate pure unary expressions', async (): Promise<void> => {
      const line = 'G0X[cos[90]]';
      const ast = parseLine(line);
      const [ command ] = await interpreter.readLine(ast);
      expect(command.command.code).to.be.equal('G');
      expect(command.command.value).to.be.equal(0);
      expect(command.getWordValue('X') - 0).to.be.lessThan(1e-4);
    });
    it('should evaluate pure binary expressions', async (): Promise<void> => {
      const line = 'G0X[90+4/2]';
      const ast = parseLine(line);
      const [ command ] = await interpreter.readLine(ast);
      expect(command.command.code).to.be.equal('G');
      expect(command.command.value).to.be.equal(0);
      expect(command.getWordValue('X')).to.be.equal(92);
    });
    it('should evaluate mixed expressions', async (): Promise<void> => {
      const line = 'G0X[cos[43+4/2]-sin[0]]';
      const ast = parseLine(line);
      const [ command ] = await interpreter.readLine(ast);
      expect(command.command.code).to.be.equal('G');
      expect(command.command.value).to.be.equal(0);
      expect(command.getWordValue('X') - 0.7071).to.be.lessThan(1e-4);
    });
  });
});