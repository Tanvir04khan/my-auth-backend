export type UserType = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  accessToken: string;
  refreshToken: string;
};

export type GetUserResponse = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  refreshToken: string;
  refreshTokenExpiry: string;
};

export type QueryReturnType = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  refreshToken: string;
};
