import { Router } from "express";
import { getUsers } from "../../controller/v1/getUsers";
import { verifyJWTToken } from "../../middleware/verifyJWTToken";

const userRouter = Router();

userRouter.post("/v1/users", verifyJWTToken, getUsers);

export default userRouter;
