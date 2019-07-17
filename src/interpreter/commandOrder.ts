import { CommandBlock } from './types';

class SortingRule<T> {
  public readonly precedence: number;
  public readonly test: (t: T) => boolean;

  public constructor (test: (t: T) => boolean, precedence: number) {
    this.precedence = precedence;
    this.test = test;
  }
}

/**
 * Sorting rules in execution order.
 */
const sortingRules = [
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'G') && ([93, 94].includes(b.command.code)), 0),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'F'), 1),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'S'), 2),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'M') && (b.command.code === 6), 3),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'M') && ([3, 4, 5].includes(b.command.code)), 4),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'M') && ([7, 8, 9].includes(b.command.code)), 5),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'M') && ([48, 49].includes(b.command.code)), 6),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'G') && (b.command.code === 4), 7),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'G') && ([17, 18, 19].includes(b.command.code)), 8),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'G') && ([20, 21].includes(b.command.code)), 9),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'G') && ([40, 41, 42].includes(b.command.code)), 10),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'G') && ([43, 49].includes(b.command.code)), 11),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'G') && ([54, 55, 56, 57, 58, 59, 59.1, 59.2, 59.3].includes(b.command.code)), 12),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'G') && ([61, 61.1, 64.4].includes(b.command.code)), 13),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'G') && ([90, 91].includes(b.command.code)), 14),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'G') && ([98, 99].includes(b.command.code)), 15),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'G') && ([10, 28, 30, 92, 92.1, 92.2, 94].includes(b.command.code)), 16),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'G') && ([0, 1, 2, 3, 53, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89].includes(b.command.code)), 17),
  new SortingRule<CommandBlock>((b: CommandBlock): boolean => (b.command.address === 'M') && ([0, 1, 2, 30, 60].includes(b.command.code)), 18)
];

const makeBlockLastRule = new SortingRule<CommandBlock>((b: CommandBlock): boolean => true, 100);

const findRuleForBlock = function (block: CommandBlock): SortingRule<CommandBlock> {
  for (let i = 0; i < sortingRules.length; ++i) {
    const rule = sortingRules[i];
    if (rule.test(block)) {
      return rule;
    }
  }
  return makeBlockLastRule;
};

export function sortByExecutionOrder (blocks: CommandBlock[]): CommandBlock[] {
  return blocks.slice().sort((a: CommandBlock, b: CommandBlock) => {
    const ruleA = findRuleForBlock(a);
    const ruleB = findRuleForBlock(b);
    return ruleA.precedence - ruleB.precedence;
  })
}