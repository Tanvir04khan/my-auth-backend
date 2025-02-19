import express, { json, urlencoded } from "express";
import cors from "cors";
import signupRouter from "./routes/v1/signupRouter";
import { errorHandler } from "./controller/errorHandler";
import loginRouter from "./routes/v1/loginRouter";
import userRouter from "./routes/v1/userRouter";
import { authorizedUserLookup } from "./controller/v1/authorizedUserLookup";
import cookieParser from "cookie-parser";

const app = express();

app
  .disable("x-powered-by")
  .use(urlencoded({ extended: true }))
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(json())
  .use(cookieParser())
  .get("/status", (_, res) => {
    res.json({ message: "Hello World" });
  });

app.use(signupRouter);

app.use(loginRouter);

app.use(userRouter);

app.post("/v1/authorizeduser-lookup", authorizedUserLookup);

app.use(errorHandler);

app.listen(5000, () => {
  console.log("server running on 5000");
});
