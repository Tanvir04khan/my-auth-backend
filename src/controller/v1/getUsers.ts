import { NextFunction, Request, Response } from "express";
import { ErrorModel } from "../../models/errorModel";
import {
  APIStatus,
  ErrorMessages,
  StatusCode,
  SuccessMessage,
} from "../../utils";
import pool from "../../database";
import { getUsersQuery } from "../../queries";
import { ResponseModel } from "../../models/responseModel";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    if (!email || !email.length) {
      throw new ErrorModel(StatusCode.BAD_REQUEST, ErrorMessages.GET_USERS);
    }

    const { rows: users } = await pool.query<{
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumer: string;
    }>(getUsersQuery, [email]);

    if (!users.length) {
      throw new ErrorModel(
        StatusCode.NOT_FOUND,
        ErrorMessages.GET_USERS_NOT_FOUND
      );
    }

    res.status(StatusCode.OK).json(
      new ResponseModel<
        {
          userId: string;
          firstName: string;
          lastName: string;
          email: string;
          phoneNumer: string;
        }[]
      >(APIStatus.SUCCESS, StatusCode.OK, SuccessMessage.USERS, users)
    );
  } catch (e) {
    next(e);
  }
};
