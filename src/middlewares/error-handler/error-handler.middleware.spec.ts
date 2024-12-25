import { HttpStatusCode } from "axios";
import { ApiError } from "../../classes/api-error";
import { errorHandler } from "./error-handler.middleware";
import { NextFunction, Request, Response } from "express";

fdescribe("errorHandler", () => {
  it("should return a response object with a status code and message", () => {
    const error = new ApiError(
      "Internal Server Error",
      HttpStatusCode.NotFound,
      "InternalServerError"
    );
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    const next = jest.fn() as NextFunction;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NotFound);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      type: "InternalServerError",
    });
  });
  it("should return only message with status 500", () => {
    const error = new Error("Test Error");
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    const next = jest.fn() as NextFunction;

    errorHandler(error as ApiError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Test Error",
    });
  });
});
