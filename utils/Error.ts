export class APIError extends Error {
  declare code: string;
  constructor(message: string, code: string = "invalid code ") {
    super(message);
    this.message = message;
    this.code = code;
  }
}
