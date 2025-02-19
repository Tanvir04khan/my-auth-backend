export const checkPhoneAndEmail = `SELECT "firstName", "lastName" FROM users WHERE "email" = $1 OR "phoneNumber" = $2`;
export const insertUser = `INSERT INTO "users" (
    "firstName",
    "lastName",
    "phoneNumber",
    "email",
    "password"
) VALUES 
  ($1, $2, $3, $4, $5) RETURNING *`;

export const updateRefreshToken = `UPDATE users SET "refreshToken" = $1, "refreshTokenExpiry" = $2 where "userId" = $3 RETURNING *`;

export const getLoginDetails = `SELECT "userId", "firstName", "lastName", "phoneNumber", "email", "password" FROM users WHERE "email" = $1`;

export const getUsersQuery = `SELECT "userId", "firstName", "lastName", "email", "phoneNumber" FROM users WHERE  "email" = ANY($1)`;

export const getUser = `SELECT * FROM users WHERE "userId" = $1`;
