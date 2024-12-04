import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { ensureSalesManager } from "../utils/authentication";
import {
  assignSalesExecutive,
  getAllSalesExecutives,
  getOrders,
  getSalesCompleteDetails,
  getSalesPendingDetails,
  getSalesUnderProcessingDetails,
  searchInfo,
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

route.get(
  "/sales-complete",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { options } = req.query;
      res
        .status(StatusCodes.OK)
        .send(await getSalesCompleteDetails(options as string));
    } catch (error) {
      next(error);
    }
  }
);

route.get(
  "/sales-pending",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { options } = req.query;
      res
        .status(StatusCodes.OK)
        .send(await getSalesPendingDetails(options as string));
    } catch (error) {
      next(error);
    }
  }
);

route.get(
  "/sales-underprocessing",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { options } = req.query;
      res
        .status(StatusCodes.OK)
        .send(await getSalesUnderProcessingDetails(options as string));
    } catch (error) {
      next(error);
    }
  }
);

route.get(
  "/search-info",
  ensureSalesManager,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = (req as any).body;
      res
        .status(StatusCodes.OK)
        .send(await searchInfo(options, (req as any).user));
    } catch (error) {
      next(error);
    }
  }
);
export default route;
