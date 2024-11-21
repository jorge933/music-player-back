import { NextFunction, Request, Response } from "express";
import { ApiError } from "../classes/api-error";

export function errorHandler(
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { statusCode, message, type } = error;
  const responseObj: { [key: string]: string } = { message, type };

  console.log(error);
  res.status(statusCode || 500).json(responseObj);
}
