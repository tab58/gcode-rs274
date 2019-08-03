import { CommandBlock } from '../../types';

class SortingRule<T> {
  public readonly precedence: number;
  public readonly test: (t: T) => boolean;

  public constructor (test: (t: T) => boolean, precedence: number) {
    this.precedence = precedence;
    this.test = test;
  }
}

/**
 * Sorting rule conditions in execution order.
 */
const ruleConditions = [
  (b: CommandBlock): boolean => (b.command.code === 'G') && ([93, 94].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'F'),
  (b: CommandBlock): boolean => (b.command.code === 'S'),
  (b: CommandBlock): boolean => (b.command.code === 'M') && (b.command.value === 6),
  (b: CommandBlock): boolean => (b.command.code === 'M') && ([3, 4, 5].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'M') && ([7, 8, 9].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'M') && ([48, 49].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'G') && (b.command.value === 4),
  (b: CommandBlock): boolean => (b.command.code === 'G') && ([17, 18, 19].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'G') && ([20, 21].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'G') && ([40, 41, 42].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'G') && ([43, 49].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'G') && ([54, 55, 56, 57, 58, 59, 59.1, 59.2, 59.3].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'G') && ([61, 61.1, 64.4].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'G') && ([90, 91].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'G') && ([98, 99].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'G') && ([10, 28, 30, 92, 92.1, 92.2, 94].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'G') && ([53].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'G') && ([80].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'G') && ([0, 1, 2, 3, 81, 82, 83, 84, 85, 86, 87, 88, 89].includes(b.command.value)),
  (b: CommandBlock): boolean => (b.command.code === 'M') && ([0, 1, 2, 30, 60].includes(b.command.value))
];
const sortingRules = ruleConditions.map((condition: (b: CommandBlock) => boolean, index: number): SortingRule<CommandBlock> => new SortingRule<CommandBlock>(condition, index));

const makeBlockLastRule = new SortingRule<CommandBlock>((): boolean => true, 100);
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
  return blocks.slice().sort((a: CommandBlock, b: CommandBlock): number => {
    const ruleA = findRuleForBlock(a);
    const ruleB = findRuleForBlock(b);
    return ruleA.precedence - ruleB.precedence;
  });
}