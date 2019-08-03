export enum Plane3D {
  XY = 'xy',
  YZ = 'yz',
  XZ = 'xz'
}

export enum MeasurementUnit {
  Inches = 'in',
  Millimeters = 'mm'
}

export enum FeedrateMode {
  Normal = 'unitsPerMinute',
  Inverse = 'minutesPerUnit'
}

export enum CoordinateSystem {
  C1 = 1,
  C2,
  C3,
  C4,
  C5,
  C6,
  C7,
  C8,
  C9
}

export enum Toggle {
  On = 'on',
  Off = 'off'
}

export enum PathControlMode {
  ExactPath = 'exactPath',
  ExactStop = 'exactStop',
  Continuous = 'continuous'
}

export enum DistanceMode {
  Absolute = 'absolute',
  Incremental = 'incremental'
}

export interface MachineState {
  plane: Plane3D;
  units: MeasurementUnit;
  feedrate: FeedrateMode;
  coordinateSystem: CoordinateSystem;
  cutterRadCompensation: Toggle;
  pathControlMode: PathControlMode;
  distanceMode: DistanceMode;
  modals: { [key: string]: number };
}