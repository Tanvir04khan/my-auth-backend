import { NextFunction, Request, Response } from "express";
import { ErrorModel } from "../models/errorModel";
import { ErrorMessages, serverKey, StatusCode } from "../utils";
import { verify } from "jsonwebtoken";

export const verifyJWTToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  console.log(authorization);
  try {
    if (!authorization) {
      throw new ErrorModel(
        StatusCode.UNAUTHORIZED,
        ErrorMessages.NOT_AUTHORIZE
      );
    }

    const JWTToken = authorization?.split(" ")[1];

    const decodedToken = verify(JWTToken, serverKey);

    if (!decodedToken) {
      throw new ErrorModel(
        StatusCode.UNAUTHORIZED,
        ErrorMessages.NOT_AUTHORIZE
      );
    }

    next();
  } catch (e) {
    next(e);
  }
};
