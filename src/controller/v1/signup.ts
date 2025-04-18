import { NextFunction, Request, Response } from "express";
import {
  ErrorMessages,
  StatusCode,
  APIStatus,
  serverKey,
  saltRound,
  SuccessMessage,
  generateRefreshTokenJwtToken,
} from "../../utils";
import pool from "../../database";
import { checkPhoneAndEmail, insertUser } from "../../queries";
import { ErrorModel } from "../../models/errorModel";
import bcrypt from "bcrypt";
import { ResponseModel } from "../../models/responseModel";
import { GetUserResponse, QueryReturnType, UserType } from "../../types";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;
  console.log(req.body);
  try {
    if (!phoneNumber || !password) {
      throw new ErrorModel(
        StatusCode.BAD_REQUEST,
        ErrorMessages.SIGNUP_DETAILS
      );
    }
    const { rows: users } = await pool.query(checkPhoneAndEmail, [phoneNumber]);

    if (users.length > 0) {
      throw new ErrorModel(StatusCode.CONFLICT, ErrorMessages.ALREADY_EXISTS);
    }

    const hashedPassword = bcrypt.hashSync(password + serverKey, saltRound);

    const { rows: user } = await pool.query<QueryReturnType>(insertUser, [
      firstName ?? null,
      lastName ?? null,
      phoneNumber,
      email ?? null,
      hashedPassword,
    ]);

    if (!user.length) {
      throw new ErrorModel(
        StatusCode.SERVER_ERROR,
        ErrorMessages.INTERNAL_SERVER_ERROR
      );
    }

    const { refreshToken, jwtToken } = await generateRefreshTokenJwtToken({
      userId: user[0].userId,
      phoneNumber: user[0].phoneNumber,
    });

    const { password: userpassword, ...userWithoutPassword } = user[0];

    res.status(StatusCode.CREATED).json(
      new ResponseModel<UserType>(
        APIStatus.SUCCESS,
        StatusCode.CREATED,
        SuccessMessage.SIGNUP,
        {
          ...(userWithoutPassword as UserType),
          accessToken: jwtToken,
          refreshToken,
        }
      )
    );
  } catch (e) {
    console.log("abs", e);
    next(e);
  }
};

export default signup;
