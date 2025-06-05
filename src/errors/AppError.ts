export class AppError extends Error {
  public readonly code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
