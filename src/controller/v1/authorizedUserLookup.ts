import { generateRefreshTokenJwtToken, serverKey } from "./../../utils";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import {
  APIStatus,
  ErrorMessages,
  StatusCode,
  SuccessMessage,
} from "../../utils";
import { ResponseModel } from "../../models/responseModel";
import { GetUserResponse, UserType } from "../../types";
import { ErrorModel } from "../../models/errorModel";
import pool from "../../database";
import { getUser } from "../../queries";

export const authorizedUserLookup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, refreshToken } = req.body;
  console.log("input", refreshToken);
  try {
    if (!userId || !refreshToken) {
      console.log("issue with userId and token");
      throw new ErrorModel(
        StatusCode.UNAUTHORIZED,
        ErrorMessages.NOT_AUTHORIZE
      );
    }

    const { rows: user } = await pool.query<GetUserResponse>(getUser, [userId]);

    if (!user.length) {
      throw new ErrorModel(
        StatusCode.NOT_FOUND,
        ErrorMessages.GET_USERS_NOT_FOUND
      );
    }

    const refreshTokenExpiry = new Date(user[0].refreshTokenExpiry);
    const currentDate = new Date();

    if (
      Date.parse(refreshTokenExpiry.toUTCString()) <
      Date.parse(currentDate.toUTCString())
    ) {
      console.log("expired");
      throw new ErrorModel(
        StatusCode.UNAUTHORIZED,
        ErrorMessages.NOT_AUTHORIZE
      );
    }

    const isValidRefreshToken = bcrypt.compareSync(
      refreshToken + serverKey,
      user[0].refreshToken
    );
    console.log(isValidRefreshToken);
    if (!isValidRefreshToken) {
      throw new ErrorModel(
        StatusCode.UNAUTHORIZED,
        ErrorMessages.NOT_AUTHORIZE
      );
    }

    const { jwtToken, refreshToken: newRefreshToken } =
      await generateRefreshTokenJwtToken({
        userId: user[0].userId,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
      });

    console.log("output", newRefreshToken);

    res.status(StatusCode.OK).json(
      new ResponseModel<UserType>(
        APIStatus.SUCCESS,
        StatusCode.OK,
        SuccessMessage.LOGIN,
        {
          userId: user[0].userId,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          phoneNumber: user[0].phoneNumber,
          email: user[0].email,
          refreshToken: newRefreshToken,
          accessToken: jwtToken,
        }
      )
    );
  } catch (e) {
    next(e);
  }
};
