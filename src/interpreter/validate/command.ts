import { getModalGroup, isNonmodalCode, modalGroups, nonModalGroups } from '../modals';
import { WordBlock, CommandBlock } from '../types';

/**
 * Determines if the address blocks for the line have 2 or more commands from the same modal group.
 * @param commandBlocks The address blocks for the line.
 * @returns {boolean} Returns true if modals do not interfere, false if they do.
 */
export function areModalsUnique (commandBlocks: CommandBlock[]): boolean {
  if (commandBlocks.length === 0) {
    console.warn('WARN: No modal commands.');
    return true;
  }
  const modalGroups = commandBlocks.map((addressBlock: CommandBlock): string => {
    const { address, code } = addressBlock.command;
    const group = getModalGroup(address, code);
    return group;
  });
  // if modalGroups have undefined values, they shouldn't be considered in modal check.
  const [groupName, ...groupNames] = modalGroups.filter((gName: string): boolean => gName !== undefined || gName !== null);
  if (groupNames.length > 0) {
    return !groupNames.reduce((acc: boolean, groupNameStr: string): boolean => (acc || (groupName === groupNameStr)), false);
  } else {
    return true;
  }
}

/**
 * Checks if the commands have axis-related words.
 */
function groupHasAxisWords (commandBlocks: CommandBlock[]): boolean {
  return commandBlocks.reduce((acc1: boolean, commandBlock: CommandBlock): boolean => {
    return (acc1 || commandBlock.reduceWords((acc2: boolean, word: WordBlock): boolean => {
      return (acc2 || ['A', 'B', 'C', 'X', 'Y', 'Z'].includes(word.address));
    }, false));
  }, false);
}

/**
 * Determines if the address blocks contain Group 0 and Group 1 commands, and if yes,
 * they determine if there are Group 0 (nonmodal) and Group 1 (modal) commands with axis words.
 * @param commandBlock The address blocks.
 * @returns {boolean} True if there is an error, false if not.
 */
function doModalsClashWithNonmodals (commandBlock: CommandBlock[]): boolean {
  const gBlocks = commandBlock.filter((commandBlock: CommandBlock): boolean => commandBlock.command.address === 'G');
  if (gBlocks.length !== 0) {
    const g1 = modalGroups.G.motion;
    const g0 = nonModalGroups.G.all;
    
    const g0Blocks = gBlocks.filter((block: CommandBlock): boolean => g0.includes(block.command.code));
    const g1Blocks = gBlocks.filter((block: CommandBlock): boolean => g1.includes(block.command.code));
    if (g0Blocks.length !== 0 && g1Blocks.length !== 0) {
      const g0HasAxes = groupHasAxisWords(g0Blocks);
      const g1HasAxes = groupHasAxisWords(g1Blocks);
      return (g0HasAxes && g1HasAxes);
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/**
 * Checks if modals and nonmodal codes clash.
 */
export function areModalNonModalsClashing (commandBlocks: CommandBlock[]): boolean {
  // check to see if Group 1 and Group 0 are present, and if so
  // see if they use axis words. If yes, then throw an error.
  const nonModalCodes = commandBlocks.filter((cmdBlock: CommandBlock): boolean => {
    const { address, code } = cmdBlock.command;
    return isNonmodalCode(address, code);
  });
  const modalNonmodalClash = (nonModalCodes.length > 0)
    ? doModalsClashWithNonmodals(commandBlocks)
    : false;

  return modalNonmodalClash;
}