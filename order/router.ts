import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { getOrderById } from "./module";
const route = Router();

route.get(
  "/get-order:/id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      res.status(StatusCodes.OK).send(await getOrderById(id));
    } catch (error) {
      next(error);
    }
  }
);

export default route;
