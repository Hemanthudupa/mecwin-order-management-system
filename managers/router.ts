import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { ensureSalesManager } from "../utils/authentication";
import { getOrders } from "./module";
const route = Router();

route.get(
  "/get-orders",
  ensureSalesManager,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { managerId, id } = (req as any).user;
      res.status(StatusCodes.OK).send(await getOrders(managerId, id));
    } catch (error) {
      next(error);
    }
  }
);

export default route;
