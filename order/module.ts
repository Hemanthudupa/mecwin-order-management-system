import { APIError } from "../utils/Error";
import { Order } from "./model";

export async function getOrderById(id: string) {
  try {
    const order = await Order.findOne({
      where: {
        id,
      },
    });
    if (!order) {
      throw new APIError(" invlaid order id ", " INVLAID ORDER ID ");
    }
    return order;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
