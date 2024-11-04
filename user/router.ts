import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { login } from "./module";
import { join } from "path";
import { fileMulter } from "../utils/files/distributor_attachments/attachments";
import sharp from "sharp";
import compressPDF from "pdf-compressor";
import { ensureAdmin, ensureUser } from "../utils/authentication";
const app = Router();
app.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phoneNumber, password } = req.body;
    res.status(StatusCodes.OK).send(await login(email, phoneNumber, password));
  } catch (error) {
    next(error);
  }
});

export default app;
