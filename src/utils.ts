import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import pool from "./database";
import { updateRefreshToken } from "./queries";
import { sign } from "jsonwebtoken";

export enum ErrorMessages {
  SIGNUP_DETAILS = "Please provide valid user details.",
  ALREADY_EXISTS = "User with this email or phone already exists.",
  INTERNAL_SERVER_ERROR = "Internal server error.",
  LOGIN_DETAILS = "Please provide valid login details.",
  INVALID_CREDS = "Invalid email or password. Please try again.",
  GET_USERS = "Please provide valid users details.",
  GET_USERS_NOT_FOUND = "No user found.",
  NOT_AUTHORIZE = "Not authorized.",
}

export enum SuccessMessage {
  SIGNUP = "User created successfully.",
  LOGIN = "Logged in successfully.",
  USERS = "Users found.",
}

export enum APIStatus {
  SUCCESS = "success",
  ERROR = "error",
}

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  SERVER_ERROR = 500,
}

export const saltRound = 10;
export const serverKey = "MY_AUTH_BY_TANVIR";
export const jwtExpiry = "12h";

export const getRefreshTokenDetails = () => {
  const token = randomBytes(64).toString("hex");

  const hashedRefreshToken = bcrypt.hashSync(token + serverKey, saltRound);

  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30);

  return { token, hashedRefreshToken, refreshTokenExpiry };
};

export const generateRefreshTokenJwtToken = async (userDetails: {
  userId: string;
  phoneNumber: string;
}) => {
  const { token, hashedRefreshToken, refreshTokenExpiry } =
    getRefreshTokenDetails();

  await pool.query(updateRefreshToken, [
    hashedRefreshToken,
    refreshTokenExpiry,
    userDetails.userId,
  ]);

  const jwtToken = sign(
    {
      userId: userDetails.userId,
      phoneNumber: userDetails.phoneNumber,
    },
    serverKey,
    { expiresIn: jwtExpiry }
  );

  return { refreshToken: token, jwtToken };
};
