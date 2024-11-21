export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly type: string;

  constructor(message: string, statusCode: number, type: string) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
  }
}
