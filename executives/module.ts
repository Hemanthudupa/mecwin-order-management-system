import { Op } from "sequelize";
import { Order } from "../order/model";
import { APIError } from "../utils/Error";
import { SalesExce_Order_Relation } from "./sales-exe-orders-relation-model";
import { Executive } from "./model";

export async function getSalesExecutiveOrders(
  id: string,
  from: string,
  to: string,
  time: string
) {
  try {
    const whereCondition: any = {};
    if (from && to) {
      whereCondition.createdAt = {
        [Op.gte]: from,
        [Op.lte]: to,
      };
    } else if (time) {
      const date = new Date();
      if (time == "month") {
        date.setUTCDate(1);
        whereCondition.createdAt = {
          [Op.gte]: date,
        };
      } else if (time == "week") {
        const dayOfWeek = date.getUTCDay();
        date.setUTCDate(date.getUTCDate() - dayOfWeek);
        date.setUTCHours(0, 0, 0, 0);

        whereCondition.createdAt = {
          [Op.gte]: date,
        };
      } else {
        whereCondition.createdAt = {
          [Op.gte]: date,
        };
      }
    }

    const salesExe = await SalesExce_Order_Relation.findAll({
      where: {
        isActive: true,
        salesExecutivesId: id,
        ...whereCondition,
      },
    });

    console.log(salesExe, " is the sales ");
    return await Order.findAll({
      where: {
        id: { [Op.in]: salesExe.map((ele) => ele.orderId as any) },
      },
    });
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function updateOrderDetails(info: any) {
  try {
    // const validatedOrderDetials=
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
