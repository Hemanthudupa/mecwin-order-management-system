import { Op } from "sequelize";
import { Distributor } from "../distributor/model";
import { Order } from "../order/model";
import { Product } from "../products/model";
import { User } from "../user/model";
import { APIError } from "../utils/Error";
import { Manager } from "./model";

export async function getOrders(managerId: string, userId: string) {
  try {
    const manager: any = await Manager.findOne({ where: { id: managerId } });

    const orderDetails = await Order.findAll({
      include: [
        {
          model: Distributor,
          as: "customers",
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
