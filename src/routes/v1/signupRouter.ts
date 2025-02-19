import { Router } from "express";
import signup from "../../controller/v1/signup";

const signupRouter = Router();

signupRouter.post("/v1/signup", signup);

export default signupRouter;
