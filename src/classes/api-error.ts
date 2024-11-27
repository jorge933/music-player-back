export class ApiError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly type: string
  ) {
    super(message);
  }
}
