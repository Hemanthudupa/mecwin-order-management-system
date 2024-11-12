import { Op } from "sequelize";
import { Distributor } from "../distributor/model";
import { Order } from "../order/model";
import { Product } from "../products/model";
import { User } from "../user/model";
import { APIError } from "../utils/Error";
import { Manager } from "./model";
import { Executive } from "../executives/model";
import { SalesExce_Order_Relation } from "../executives/sales-exe-orders-relation-model";
import { validatorAssignSalesExecutor } from "./validation";

export async function getOrders(managerId: string, userId: string) {
  try {
    const manager: any = await Manager.findOne({ where: { id: managerId } });

    const orderDetails = await Order.findAll({
      attributes: ["id", "shipping_Address"],
      include: [
        {
          model: Distributor,
          as: "customers",
          attributes: ["id", "shipping_Address_state"],
          where: {
            state: {
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
