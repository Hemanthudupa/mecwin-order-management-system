import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getAllOrders } from "./module";

const { Router } = require("express");
let route = Router();

route.get(
  "/get-all-orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.OK).send(await getAllOrders());
    } catch (error) {
      next(error);
    }
  }
);
export default route;
