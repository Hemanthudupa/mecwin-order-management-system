import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { ensureSalesManager } from "../utils/authentication";
import {
  assignSalesExecutive,
  getAllSalesExecutives,
  getOrders,
} from "./module";
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

route.get(
  "/get-all-sales-executives",
  ensureSalesManager,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { managerId } = (req as any).user;
      res.status(StatusCodes.OK).send(await getAllSalesExecutives(managerId));
    } catch (error) {
      next(error);
    }
  }
);

route.post(
  "/assign-sales-executive",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { salesExecutiveId, orderId } = req.body;
      res
        .status(StatusCodes.CREATED)
        .send(await assignSalesExecutive(salesExecutiveId, orderId));
    } catch (error) {
      next(error);
    }
  }
);

export default route;
