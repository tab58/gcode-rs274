import { Word, WordCollection } from '../../types';
import { Plane3D, MachineState, FeedrateMode, Toggle, PathControlMode } from './enums';
import { ModalGroupName, NonmodalGroupName } from '../../modals';

export enum SelectionQuantifier {
  AtLeastOneOf,
  AllOf
}

function containsWordAddresses (quant: SelectionQuantifier, addresses: string[], wordCollection: WordCollection): boolean {
  if (quant === SelectionQuantifier.AllOf) {
    // all addresses must match
    return addresses.reduce((acc: boolean, address: string): boolean => {
      // determine if there's a match
      return acc && (wordCollection.getWordValue(address) !== undefined);
    }, true);
  } else if (quant === SelectionQuantifier.AtLeastOneOf) {
    return addresses.reduce((acc: boolean, address: string): boolean => {
      // determine if there's a match
      return acc || (wordCollection.getWordValue(address) !== undefined);
    }, false);
  } else {
    console.warn(`Quantifier ${quant} is illegal.`);
    return false;
  }
}

const oneOf: (addresses: string[], wordCollection: WordCollection) => boolean = containsWordAddresses.bind(null, SelectionQuantifier.AtLeastOneOf);
const allOf: (addresses: string[], wordCollection: WordCollection) => boolean = containsWordAddresses.bind(null, SelectionQuantifier.AllOf);
const noneOf: (addresses: string[], wordCollection: WordCollection) => boolean = (addresses: string[], wordCollection: WordCollection): boolean => !containsWordAddresses(SelectionQuantifier.AtLeastOneOf, addresses, wordCollection);


const truth = (): boolean => true;
const hasOneAxisWord = (wordCollection: WordCollection): boolean => oneOf(['A', 'B', 'C', 'X', 'Y', 'Z'], wordCollection);
const hasRotationalWords = (wordCollection: WordCollection, state: MachineState): boolean => {
  return oneOf(['A', 'B', 'C', 'X', 'Y', 'Z'], wordCollection)
    && (allOf(['R'], wordCollection)
      || (state.plane === Plane3D.XY
        ? oneOf(['I', 'J'], wordCollection)
        : state.plane === Plane3D.YZ
          ? oneOf(['J', 'K'], wordCollection)
          : state.plane === Plane3D.XZ
            ? oneOf(['I', 'K'], wordCollection)
            : false
      ));
};
const cutterRadComp = (wordCollection: WordCollection, state: MachineState): boolean => {
  const d = wordCollection.getWordValue('D');
  return (d ? Number.isInteger(d) && d >= 0 : true)
    && (state.plane === Plane3D.XY);
};
const toolOffset = (wordCollection: WordCollection): boolean => {
  const h = wordCollection.getWordValue('H');
  return allOf(['H'], wordCollection)
    && Number.isInteger(h)
    && (h >= 0);
};
const noCutterRadComp = (_: WordCollection, state: MachineState): boolean => {
  return state.cutterRadCompensation !== Toggle.On;
};
const stdCannedCycleCheck = (wordCollection: WordCollection, state: MachineState, cycleCode: number): boolean => {
  const l = wordCollection.getWordValue('L');
  const p = wordCollection.getWordValue('P');
  const r = wordCollection.getWordValue('R');

  const activePlane = state.plane === Plane3D.XY
    ? r < wordCollection.getWordValue('Z')
    : state.plane === Plane3D.XZ
      ? r < wordCollection.getWordValue('Y')
      : state.plane === Plane3D.YZ
        ? r < wordCollection.getWordValue('X')
        : false;

  const sameCycle = state.modals[ModalGroupName.GMotion] === cycleCode;

  const noNumberMissing = sameCycle || (state.plane === Plane3D.XY
    ? wordCollection.getWordValue('Z') !== undefined
    : state.plane === Plane3D.XZ
      ? wordCollection.getWordValue('Y') !== undefined
      : state.plane === Plane3D.YZ
        ? wordCollection.getWordValue('X') !== undefined
        : false);

  const stdCheck = oneOf(['X', 'Y', 'Z'], wordCollection)
    && state.feedrate === FeedrateMode.Normal
    && state.cutterRadCompensation !== Toggle.Off
    && (l !== undefined ? (Number.isInteger(l) && l >= 0) : true)
    && (p !== undefined ? (p >= 0) : true)
    && activePlane
    && noNumberMissing;

  return stdCheck;
};

/** Validates word settings for commands. */
const gCodeWordValidators: { [key: string]: (wordCollection: WordCollection, s: MachineState, c: Word) => boolean } = {
  0: hasOneAxisWord,
  1: hasOneAxisWord,
  2: hasRotationalWords,
  3: hasRotationalWords,
  4: (wordCollection: WordCollection): boolean => (oneOf(['P'], wordCollection) && wordCollection.getWordValue('P')>= 0),
  10: (wordCollection: WordCollection): boolean => {
    const p = wordCollection.getWordValue('P');
    const l = wordCollection.getWordValue('L');
    return (allOf(['P', 'L'], wordCollection)
      && (p >= 1 && p <= 9)
      && (l === 1 || l === 2));
  },
  17: truth,
  18: truth,
  19: truth,
  20: truth,
  21: truth,
  28: truth,
  30: truth,
  // G38.2 could also be G31
  38.2: (wordCollection: WordCollection, state: MachineState): boolean => {
    return (state.feedrate !== FeedrateMode.Inverse)
      && noneOf(['A', 'B', 'C'], wordCollection)
      && oneOf(['X', 'Y', 'Z'], wordCollection);
  },
  40: cutterRadComp,
  41: (wordCollection: WordCollection, state: MachineState): boolean => {
    return cutterRadComp(wordCollection, state)
      && (state.cutterRadCompensation !== Toggle.On);
  },
  42: (wordCollection: WordCollection, state: MachineState): boolean => {
    return cutterRadComp(wordCollection, state)
      && (state.cutterRadCompensation !== Toggle.On);
  },
  43: toolOffset,
  49: toolOffset,
  53: (wordCollection: WordCollection, state: MachineState): boolean => {
    const activeMotionCode = state.modals[ModalGroupName.GMotion];
    return noCutterRadComp(wordCollection, state)
      && (activeMotionCode === 0 || activeMotionCode === 1);
  },
  54: noCutterRadComp,
  55: noCutterRadComp,
  56: noCutterRadComp,
  57: noCutterRadComp,
  58: noCutterRadComp,
  59: noCutterRadComp,
  59.1: noCutterRadComp,
  59.2: noCutterRadComp,
  59.3: noCutterRadComp,
  61: (_: WordCollection, state: MachineState): boolean => state.pathControlMode === PathControlMode.ExactPath,
  61.1: (_: WordCollection, state: MachineState): boolean => state.pathControlMode === PathControlMode.ExactStop,
  64: (_: WordCollection, state: MachineState): boolean => state.pathControlMode === PathControlMode.Continuous,
  // Canned cycles
  // TODO: do a check here for group 0 and axis words
  80: (wordCollection: WordCollection): boolean => {
    return hasOneAxisWord(wordCollection)
      ? wordCollection.hasNonmodalCommandInGroup(NonmodalGroupName.HasAxisWords)
      : true;
  },
  81: (wordCollection: WordCollection, state: MachineState): boolean => {
    return stdCannedCycleCheck(wordCollection, state, 81);
  },
  82: (wordCollection: WordCollection, state: MachineState): boolean => {
    return stdCannedCycleCheck(wordCollection, state, 82);
  },
  83: (wordCollection: WordCollection, state: MachineState): boolean => {
    return stdCannedCycleCheck(wordCollection, state, 83);
  },
  84: (wordCollection: WordCollection, state: MachineState): boolean => {
    return stdCannedCycleCheck(wordCollection, state, 84);
  },
  85: (wordCollection: WordCollection, state: MachineState): boolean => {
    return stdCannedCycleCheck(wordCollection, state, 85);
  },
  86: (wordCollection: WordCollection, state: MachineState): boolean => {
    return stdCannedCycleCheck(wordCollection, state, 86);
  },
  87: (wordCollection: WordCollection, state: MachineState): boolean => {
    return stdCannedCycleCheck(wordCollection, state, 87);
  },
  88: (wordCollection: WordCollection, state: MachineState): boolean => {
    return stdCannedCycleCheck(wordCollection, state, 88);
  },
  89: (wordCollection: WordCollection, state: MachineState): boolean => {
    return stdCannedCycleCheck(wordCollection, state, 89);
  },
  90: truth,
  91: truth,
  92: hasOneAxisWord,
  92.1: hasOneAxisWord,
  92.2: hasOneAxisWord,
  92.3: hasOneAxisWord,
  93: (wordCollection: WordCollection, state: MachineState): boolean => {
    const collectionHasG123 = wordCollection.hasCommand('G', 1)
      || wordCollection.hasCommand('G', 2)
      || wordCollection.hasCommand('G', 3);
    const activeMotion = state.modals[ModalGroupName.GMotion];
    const modalsHaveG123 = [1, 2, 3].includes(activeMotion);

    const hasFWord = wordCollection.getWordValue('F') !== undefined;

    return (state.feedrate === FeedrateMode.Inverse
      ? (collectionHasG123 || modalsHaveG123) && hasFWord
      : true);
  },
  94: truth,
  98: (wordCollection: WordCollection): boolean => wordCollection.getWordValue('R') !== undefined,
  99: (wordCollection: WordCollection): boolean => wordCollection.getWordValue('R') !== undefined
};

const mCodeWordValidators: { [key: string]: (wordCollection: WordCollection, s: MachineState) => boolean } = {
  0: truth,
  1: truth,
  2: truth,
  3: truth,
  4: truth,
  5: truth,
  6: truth,
  7: truth,
  8: truth,
  9: truth,
  30: truth,
  48: truth,
  49: truth,
  60: truth
};

export const commandWordValidators: { [key: string]: { [key: string]: (wordCollection: WordCollection, s: MachineState, c: Word) => boolean } } = {
  G: gCodeWordValidators,
  M: mCodeWordValidators
};