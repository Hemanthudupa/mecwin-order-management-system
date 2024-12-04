import { Op } from "sequelize";
import { Distributor } from "../distributor/model";
import { Order } from "../order/model";
import { Product } from "../products/model";
import { User } from "../user/model";
import { APIError } from "../utils/Error";
import { Manager } from "./model";
import { Executive } from "../executives/model";
import { SalesExce_Order_Relation } from "../executives/sales-exe-orders-relation-model";
import {
  validateSearchOptions,
  validatorAssignSalesExecutor,
} from "./validation";
import { object } from "joi";

export async function getOrders(managerId: string, userId: string) {
  try {
    const manager: any = await Manager.findOne({ where: { id: managerId } });

    const orderDetails = await Order.findAll({
      attributes: ["id", "shipping_Address"],
      where: {
        isActive: true,
      },
      include: [
        {
          model: Distributor,
          as: "customers",
          attributes: ["id", "shipping_Address_state"],
          where: {
            shipping_Address_state: {
              [Op.in]: manager.work_locations,
            },
          },
        },
        {
          model: Product,
          as: "products",
        },
      ],
    });

    return orderDetails;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getAllSalesExecutives(managerId: string) {
  try {
    const executives = await Executive.findAll({
      where: { managerId },
      include: {
        model: User,
        as: "user",
        where: { isActive: true },
      },
    });
    return executives;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function assignSalesExecutive(
  salesExecutivesId: any,
  orderId: any
) {
  try {
    const validatedSalesExecutive =
      await validatorAssignSalesExecutor.validateAsync({
        salesExecutivesId,
        orderId,
      });
    const order: any = await Order.findOne({
      where: {
        id: validatedSalesExecutive.orderId,
      },
    });
    const executive: any = await Executive.findOne({
      where: {
        id: validatedSalesExecutive.salesExecutivesId,
      },
    });
    if (!order) {
      throw new APIError("  invalid order id ", " INVALID ID ");
    }
    if (!executive) {
      throw new APIError("  invalid executive id ", " INVALID ID ");
    }

    const salesExe_order = await SalesExce_Order_Relation.create({
      salesExecutivesId: executive.id,
      orderId: order.id,
    });
    return {
      message: " successfully  sales executive assigned to an order ",
      salesExe_order,
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getSalesCompleteDetails(options: string) {
  try {
    if (options) {
      return {
        message: " successfuly fetched count details completed sales",
        count: await Order.count({
          where: { approved_by_sales: true },
        }),
      };
    }
    return await Order.findAll({
      where: {
        approved_by_sales: true,
      },
    });
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getSalesPendingDetails(options: string) {
  try {
    if (options) {
      return {
        message: " successfuly fetched count details of pending sales",
        count: await Order.count({
          where: { approved_by_sales: false },
        }),
      };
    }
    return await Order.findAll({
      where: {
        approved_by_sales: false,
      },
    });
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
export async function getSalesUnderProcessingDetails(options: string) {
  try {
    if (options) {
      return {
        message: " successfuly fetched count details of pending sales",
        count: await SalesExce_Order_Relation.count({
          where: { isUnderProcess: true },
        }),
      };
    }
    return await SalesExce_Order_Relation.findAll({
      where: {
        isUnderProcess: true,
      },
    });
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function searchInfo(options: any, req: any) {
  try {
    await validateSearchOptions.validateAsync(options);
    if (Object.keys(options).length == 0) {
      console.log(req);
      return await Order.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            {
              shipping_Address: {
                [Op.in]: req.work_locations,
              },
            },
            {
              billing_Address: {
                [Op.in]: req.work_locations,
              },
            },
          ],
        },
      });
    }
    if (Object.keys(options)[0] == "orderid") {
      return await Order.findAll({
        where: {
          isActive: true,
          id: {
            [Op.like]: `%${options.orderid}%`,
          },
          [Op.or]: [
            {
              shipping_Address: {
                [Op.in]: req.work_locations,
              },
            },
            {
              billing_Address: {
                [Op.in]: req.work_locations,
              },
            },
          ],
        },
      });
    } else if (Object.keys(options)[0] == "customerid") {
      return await Distributor.findAll({
        where: {
          id: {
            [Op.like]: `%${options.customerId}%`,
          } as any,
          [Op.or]: [
            {
              shipping_Address: {
                [Op.in]: req.work_locations,
              },
            },
            {
              billing_Address: {
                [Op.in]: req.work_locations,
              },
            },
          ],
        },
      });
    } else {
      return await Executive.findAll({
        where: {
          id: {
            [Op.like]: `%${options.employeeId}%`,
          },
          managerId: req.managerId,
        },
      });
    }
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
