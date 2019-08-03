import { InterpreterStage } from "../interpreterStage";
import { CommandBlock, WordCollection, Word } from "../../types";
import { commandWordValidators } from './validators';
import { sortByExecutionOrder } from './sortByExecutionOrder';
import {
  getModalGroupName
} from '../../modals';
import { commandBuilders } from './builders';
import {
  Plane3D,
  MeasurementUnit,
  FeedrateMode,
  CoordinateSystem,
  MachineState,
  Toggle,
  PathControlMode,
  DistanceMode
} from './enums';


/** Interprets commands for semantic correctness. */
export class CommandStage implements InterpreterStage<WordCollection, CommandBlock[]> {
  public readonly name = 'Semantic';
  
  private _plane: Plane3D;
  private _units: MeasurementUnit;
  private _feedrate: FeedrateMode;
  private _cSys: CoordinateSystem;
  private _cutterRadCompensation: Toggle;
  private _pathControlMode: PathControlMode;
  private _distanceMode: DistanceMode;
  private _modalCommandMap: { [key: string]: number };

  public constructor () {
    // input default values
    this._plane = null;
    this._units = null;
    this._feedrate = null;
    this._cSys = CoordinateSystem.C1;
    this._cutterRadCompensation = Toggle.Off;
    this._pathControlMode = null;
    this._distanceMode = null;
    this._modalCommandMap = {};
  }

  /** Gets the state of the "machine". */
  private _getState (): MachineState {
    return {
      plane: this._plane,
      units: this._units,
      feedrate: this._feedrate,
      coordinateSystem: this._cSys,
      cutterRadCompensation: this._cutterRadCompensation,
      pathControlMode: this._pathControlMode,
      distanceMode: this._distanceMode,
      modals: this._modalCommandMap
    };
  }

  /** Validates the input words in the commands.  */
  private _validateCommandWords (collection: WordCollection): boolean {
    const state = this._getState();

    return collection.reduceCommands((acc: boolean, command: Word): boolean => {
      // TODO: make sure all validators work here, not just G-code ones
      const { code, value } = command;
      const codeValidators = commandWordValidators[code];
      if (codeValidators) {
        const validator = codeValidators[value];
        if (validator) {
          return acc && validator(collection, state, command);
        } else {
          // we have a bad command without a validator
          console.error(`Command code "${code}${value}" does not have a validator.`);
          return false;
        }
      } else {
        // this isn't a command code
        console.error(`Command code group "${code}" does not have a validator group.`);
        return false;
      }
    }, true);
  }

  public validate (collection: WordCollection): boolean {
    return this._validateCommandWords(collection);
  }

  private _buildCommandBlock (command: Word, words: { [key: string]: number }): CommandBlock {
    const { code, value } = command;
    const builder = commandBuilders[code][value];
    return builder(command, words);
  }

  public processLineArtifacts (collection: WordCollection): CommandBlock[] {
    const commands = collection.mapCommands<CommandBlock>((command, words): CommandBlock => this._buildCommandBlock(command, words));

    // update the command map
    collection.forEachCommand((command): void => {
      const { code, value } = command;
      const modalGroupName = getModalGroupName(code, value);
      this._modalCommandMap[modalGroupName] = value;
    });

    // do other commands here, like S-words
    const s = collection.getWordValue('S');
    if (Number.isFinite(s)) {
      commands.push(new CommandBlock({ code: 'S', value: s }));
    }

    return sortByExecutionOrder(commands);
  }
}