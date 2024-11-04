import express, { NextFunction, Request, Response } from "express";
export const app = express();
import user from "./user/router";
import { APIError } from "./utils/Error";
import { StatusCodes } from "http-status-codes";
import { ensureUser } from "./utils/authentication";
import admin from "./admin/router";
// import morgan from "morgan";
// app.use(morgan("dev"));
app.use((req, res, next) => {
  req.on("end", () => {
    console.log(`Request: ${req.method} ${req.url}`);
  });
  res.on("finish", () => {
    console.log(`Response: ${res.statusCode}`);
  });
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", user);
app.use(ensureUser);

app.use("/admin", admin);

app.use(errorHandler);
function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof APIError) {
    console.log((err as APIError).message, (err as APIError).code);
    res.status(StatusCodes.BAD_REQUEST).send({
      message: (err as APIError).message,
      code: (err as APIError).code,
    });
  } else {
    console.log(err.message, 400);
    res.status(StatusCodes.BAD_REQUEST).send({
      message: err.message,
      code: (err as APIError).code || "INVALID CODE !!!",
    });
  }
}
