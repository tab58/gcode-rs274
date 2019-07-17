// Group 1, the first group on the table, is a group of G codes for motion. One of
// these is always in effect. That one is called the current motion mode.

// It is an error to put a G-code from group 1 and a G-code from group 0
// on the same line if both of them use axis words. If an axis word-using
// G-code from group 1 is implicitly in effect on a line (by having been activated
// on an earlier line), and a group 0 G-code that uses axis words appears on the
// line, the activity of the group 1 G-code is suspended for that line. The axis
// word-using G-codes from group 0 are G10, G28, G30, and G92.
export const modalAddressCodes = ['G', 'M'];

export const axisWordAddresses = ['A', 'B', 'C', 'X', 'Y', 'Z'];

export const nonModalGroups: { [key: string]: { [key: string]: number[] } } = {
  // group 0
  G: {
    // other: [4, 53, 92.1, 92.2, 92.3],
    axisWords: [10, 28, 30, 92],
    all: [4, 53, 92.1, 92.2, 92.3, 10, 28, 30, 92]
  }
};

export const modalGroups: { [key: string]: { [key: string]: number[] } } = {
  G: {
    motion: [0, 1, 2, 3, 38.2, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89], // group 1
    planeSelection: [17, 18, 19], // group 2
    distance: [90, 91], // group 3
    feedRate: [93, 94], // group 5
    units: [20, 21], // group 6
    cutterRadCompensation: [40, 41, 42], // group 7
    toolLenOffset: [43, 49], // group 8
    returnModeCanned: [98, 99], // group 10
    coordSysSelection: [54, 55, 56, 57, 58, 59, 59.1, 59.2, 59.3], // group 12
    pathControlMode: [61, 61.1, 64] // group 13
  },
  M: {
    stopping: [0, 1, 2, 30, 60], // group 4
    toolChange: [6], // group 6
    spindleTurning: [3, 4, 5], // group 7
    coolant: [7, 8, 9], // group 8
    feedSpeedSwitches: [48, 49] // group 9
  }
};

/**
 * Checks only the modal groups for two codes in the same group.
 * @param address The address of the command, e.g. the G in "G18".
 * @param code The code part of the command, e.g. the 18 in "G18".
 */
export function getModalGroup (address: string, code: number): string {
  const modalGroupCodes = modalGroups[address];
  const group = Object.keys(modalGroupCodes).reduce((acc: string, groupName: string): string => {
    const codeArray = modalGroupCodes[groupName];
    if (codeArray.includes(code)) {
      return groupName;
    }
    return acc;
  }, undefined);
  return group;
}

/** Determines if the command code is a non-modal code. */
export function isNonmodalCode (address: string, code: number): boolean {
  const nonModalGroupObjects = nonModalGroups[address];
  return !nonModalGroupObjects
    ? false
    : Object.keys(nonModalGroupObjects).reduce((acc: boolean, nonModalGroupName: string): boolean => {
      const nonModalGroupCodes = nonModalGroupObjects[nonModalGroupName];
      return (acc || nonModalGroupCodes.includes(code));
    }, false);
}