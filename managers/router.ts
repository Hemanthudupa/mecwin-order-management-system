import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  ensureSalesManager,
  ensureStoresManager,
} from "../utils/authentication";
import {
  assignSalesExecutive,
  assignStoresExecutiveOrder,
  getAllOrdersStores,
  getAllSalesExecutives,
  getAllStoresExecutives,
  getOrdersSales,
  getSalesCompleteDetails,
  getSalesPendingDetails,
  getSalesUnderProcessingDetails,
  getStoresOrderById,
  searchInfo,
} from "./module";
const route = Router();

route.get(
  "/get-orders-sales",
  ensureSalesManager,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { managerId, id } = (req as any).user;
      res.status(StatusCodes.OK).send(await getOrdersSales(managerId, id));
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
  ensureSalesManager,

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
  ensureSalesManager,

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
  ensureSalesManager,
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
  ensureSalesManager,

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

route.get(
  "/get-orders-stores",
  ensureStoresManager,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.OK).send(await getAllOrdersStores());
    } catch (error) {
      next(error);
    }
  }
);

route.get(
  "/get-order/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      res.status(StatusCodes.OK).send(await getStoresOrderById(id));
    } catch (error) {
      next(error);
    }
  }
);

route.get(
  "/get-all-stores-executives",
  ensureStoresManager,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { managerId } = (req as any).user;
      res.status(StatusCodes.OK).send(await getAllStoresExecutives(managerId));
    } catch (error) {
      next(error);
    }
  }
);

route.post(
  "/assign-stores-executive",
  ensureStoresManager,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      res.status(StatusCodes.OK).send(await assignStoresExecutiveOrder(data));
    } catch (error) {
      next(error);
    }
  }
);

export default route;
