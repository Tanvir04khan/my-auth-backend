import { Router } from "express";
import { login } from "../../controller/v1/login";

const loginRouter = Router();

loginRouter.post("/v1/login", login);

export default loginRouter;
