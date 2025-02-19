import { NextFunction, Request, Response } from "express";
import { ErrorModel } from "../../models/errorModel";
import {
  APIStatus,
  ErrorMessages,
  generateRefreshTokenJwtToken,
  serverKey,
  StatusCode,
  SuccessMessage,
} from "../../utils";
import pool from "../../database";
import { getLoginDetails } from "../../queries";
import bcrypt from "bcrypt";
import { ResponseModel } from "../../models/responseModel";
import { UserType } from "../../types";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new ErrorModel(StatusCode.BAD_REQUEST, ErrorMessages.LOGIN_DETAILS);
    }

    const { rows: user } = await pool.query(getLoginDetails, [email]);
    if (!user.length) {
      throw new ErrorModel(
        StatusCode.UNAUTHORIZED,
        ErrorMessages.INVALID_CREDS
      );
    }

    const isValidPassword = bcrypt.compareSync(
      password + serverKey,
      user[0].password
    );

    if (!isValidPassword) {
      throw new ErrorModel(
        StatusCode.UNAUTHORIZED,
        ErrorMessages.INVALID_CREDS
      );
    }

    const { refreshToken, jwtToken } = await generateRefreshTokenJwtToken({
      userId: user[0].userId,
      firstName: user[0].firststName,
      lastName: user[0].lastName,
    });

    const { password: userpassword, ...userWithoutPassword } = user[0];

    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30);

    res.status(StatusCode.OK).json(
      new ResponseModel<UserType>(
        APIStatus.SUCCESS,
        StatusCode.OK,
        SuccessMessage.LOGIN,
        {
          ...(userWithoutPassword as UserType),
          accessToken: jwtToken,
          refreshToken,
        }
      )
    );
  } catch (e) {
    next(e);
  }
};
