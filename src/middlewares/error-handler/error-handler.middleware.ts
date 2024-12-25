import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../classes/api-error";
import { HttpStatusCode } from "axios";

export function errorHandler(
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { statusCode, message, type } = error;
  const responseObj: { [key: string]: string } = { message, type };

  console.log(error);

  res
    ?.status(statusCode || HttpStatusCode.InternalServerError)
    .json(responseObj);
}
