// Group 1, the first group on the table, is a group of G codes for motion. One of
// these is always in effect. That one is called the current motion mode.

// It is an error to put a G-code from group 1 and a G-code from group 0
// on the same line if both of them use axis words. If an axis word-using
// G-code from group 1 is implicitly in effect on a line (by having been activated
// on an earlier line), and a group 0 G-code that uses axis words appears on the
// line, the activity of the group 1 G-code is suspended for that line. The axis
// word-using G-codes from group 0 are G10, G28, G30, and G92.

interface ModalWord {
  code: string;
  value: number;
}

const buildModalWord = function (word: string, code: number): ModalWord {
  return { code: word, value: code };
};

const buildModalsOfType = function (word: string, codes: number[]): ModalWord[] {
  return codes.map((code: number): ModalWord => buildModalWord(word, code));
};

/** Definition for a modal group, a collection of codes that serve a related function. */
interface ModalGroup {
  /** The codes that belong to the group. */
  codes: ModalWord[];
  /** Words that are valid for any code in the group. */
  words: string[];
}

export enum NonmodalGroupName {
  HasAxisWords = 'nonModalHasAxisWords',
  Other = 'nonModalNoAxisWords'
}

/** Group 0, the G-code nonmodal codes. */
export const nonModalCodes: { [key: string]: ModalGroup } = {
  /** Group 0 */
  [NonmodalGroupName.HasAxisWords]: {
    codes: buildModalsOfType('G', [10, 28, 30, 92]),
    words: ['A', 'B', 'C', 'X', 'Y', 'Z']
  },
  /** Group 0 */
  [NonmodalGroupName.Other]: {
    codes: buildModalsOfType('G', [4, 53, 92.1, 92.2, 92.3]),
    words: ['P']
  }
};

/** Human-readable names for the G- and M- code modal groups. */
export enum ModalGroupName {
  /** Group 1 */
  GMotion = 'motion',
  /** Group 2 */
  GPlaneSelection = 'planeSelection',
  /** Group 3 */
  GDistance = 'distance',
  /** Group 5 */
  GFeedRate = 'feedRate',
  /** Group 6 */
  GUnits = 'units',
  /** Group 7 */
  GCutterRadiusCompensation = 'cutterRadCompensation',
  /** Group 8 */
  GToolLengthOffset = 'toolLenOffset',
  /** Group 10 */
  GReturnModeCannedCycles = 'returnModeCanned',
  /** Group 12 */
  GCoordinateSystemSelection = 'coordSysSelection',
  /** Group 13 */
  GPathControlMode = 'pathControlMode',
  /** Group 4 */
  MStopping = 'stopping',
  /** Group 6 */
  MToolChange = 'toolChange',
  /** Group 7 */
  MSpindle = 'spindleTurning',
  /** Group 8 */
  MCoolant = 'coolant',
  /** Group 9 */
  MFeedSpeedSwitches = 'feedSpeedSwitches'
}

/** Codes and words that correspond to G- and M-commands. */
export const modalCodes: { [key: string]: ModalGroup  } = {
  [ModalGroupName.GMotion]: {
    codes: buildModalsOfType('G', [0, 1, 2, 3, 38.2, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89]), // group 1
    words: ['A', 'B', 'C', 'X', 'Y', 'Z', 'I', 'J', 'K', 'L', 'R', 'Q']
  },
  [ModalGroupName.GPlaneSelection]: {
    codes: buildModalsOfType('G', [17, 18, 19]), // group 2
    words: [] as string[]
  },
  [ModalGroupName.GDistance]: {
    codes: buildModalsOfType('G', [90, 91]), // group 3
    words: [] as string[]
  },
  [ModalGroupName.GFeedRate]: {
    codes: buildModalsOfType('G', [93, 94]), // group 5
    words: ['F']
  },
  [ModalGroupName.GUnits]: {
    codes: buildModalsOfType('G', [20, 21]), // group 6
    words: [] as string[]
  },
  [ModalGroupName.GCutterRadiusCompensation]: {
    codes: buildModalsOfType('G', [40, 41, 42]), // group 7
    words: ['D']
  },
  [ModalGroupName.GToolLengthOffset]: {
    codes: buildModalsOfType('G', [43, 49]), // group 8
    words: ['H']
  },
  [ModalGroupName.GReturnModeCannedCycles]: {
    codes: buildModalsOfType('G', [98, 99]), // group 10
    words: [] as string[]
  },
  [ModalGroupName.GCoordinateSystemSelection]: {
    codes: buildModalsOfType('G', [54, 55, 56, 57, 58, 59, 59.1, 59.2, 59.3]), // group 12
    words: [] as string[]
  },
  [ModalGroupName.GPathControlMode]: {
    codes: buildModalsOfType('G', [61, 61.1, 64]), // group 13
    words: [] as string[]
  },
  [ModalGroupName.MStopping]: {
    codes: buildModalsOfType('M', [0, 1, 2, 30, 60]), // group 4
    words: [] as string[]
  },
  [ModalGroupName.MToolChange]: {
    codes: buildModalsOfType('M', [6]), // group 6
    words: ['T']
  },
  [ModalGroupName.MSpindle]: {
    codes: buildModalsOfType('M', [3, 4, 5]), // group 7
    words: [] as string[]
  },
  [ModalGroupName.MCoolant]: {
    codes: buildModalsOfType('M', [7, 8, 9]), // group 8
    words: [] as string[]
  },
  [ModalGroupName.MFeedSpeedSwitches]: {
    codes: buildModalsOfType('M', [48, 49]), // group 9
    words: [] as string[]
  }
};

/** The code letters for modal commands. */
export const modalCommandLetters = ['G', 'M'];

/** The code letters for axes. */
export const modalAxisLetters = ['A', 'B', 'C', 'X', 'Y', 'Z'];

/**
 * Checks a modal code store if a word exists in it, and which modal group it belongs to if yes.
 * @param code The address of the command, e.g. the G in "G18".
 * @param value The code part of the command, e.g. the 18 in "G18".
 * @returns {string} Returns the group name or undefined if not found.
 */
function getModalGroupNameFromStore (store: { [key: string]: ModalGroup }, code: string, value: number): string {
  return Object.keys(store).reduce((acc: string, modalGroup: string): string => {
    const { codes } = store[modalGroup];
    const containsCode = codes.reduce((acc: boolean, modalWord: ModalWord): boolean => {
      return acc || (modalWord.code === code && modalWord.value === value);
    }, false);
    return containsCode
      ? modalGroup
      : acc;
  }, undefined);
}

/**
 * Determines if the word is part of a specific modal group.
 * @param code The letter part of the word.
 * @param value The numeric part of the word.
 * @param groupName The non-modal group name.
 */
export const isFromModalGroup = (code: string, value: number, groupName: ModalGroupName): boolean => {
  const { codes } = modalCodes[groupName];
  const matches = codes.filter((word: ModalWord): boolean => word.code === code && word.value === value);
  return matches.length > 0;
};

/**
 * Determines if the word is part of a specific non-modal group.
 * @param code The letter part of the word.
 * @param value The numeric part of the word.
 * @param groupName The non-modal group name.
 */
export const isFromNonmodalGroup = (code: string, value: number, groupName: NonmodalGroupName): boolean => {
  const { codes } = nonModalCodes[groupName];
  const matches = codes.filter((word: ModalWord): boolean => word.code === code && word.value === value);
  return matches.length > 0;
};

/**
 * Returns the group name for a given word, or undefined if not a modal code.
 * @param code The letter part of the word.
 * @param value The numeric part of the word.
 */
export const getModalGroupName = (code: string, value: number): string => getModalGroupNameFromStore(modalCodes, code, value);

/**
 * Returns the group name for a given word, or undefined if not a non-modal code.
 * @param code The letter part of the word.
 * @param value The numeric part of the word.
 */
export const getNonmodalGroupName = (code: string, value: number): string => getModalGroupNameFromStore(nonModalCodes, code, value);

export const getCommandGroupName = (code: string, value: number): string => {
  return getModalGroupName(code, value) || getNonmodalGroupName(code, value);
};

const getGroupNameForNonCommandWord = (modalStore: { [key: string]: ModalGroup }, code: string): string => {
  return Object.keys(modalStore).reduce((acc: string, modalGroupName: string): string => {
    const modalGroup = modalStore[modalGroupName];
    const { words } = modalGroup;
    return words.includes(code)
      ? modalGroupName
      : acc;
  }, undefined);
};

export const getModalGroupNameForNonCommandWord = getGroupNameForNonCommandWord.bind(null, modalCodes);

export const getNonModalGroupNameForNonCommandWord = getGroupNameForNonCommandWord.bind(null, nonModalCodes);

export const getCommandGroupNameForNonCommandWord = (code: string): string => {
  return getModalGroupNameForNonCommandWord(code) || getNonModalGroupNameForNonCommandWord(code);
};