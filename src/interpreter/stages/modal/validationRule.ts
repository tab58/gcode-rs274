export class ValidationRule<T> {
  public readonly name: string;
  private _predicate: (t: T) => boolean;

  public constructor (name: string, predicate: (t: T) => boolean) {
    this.name = name;
    this._predicate = predicate;
  }

  public test (t: T): boolean { return this._predicate(t); }
}