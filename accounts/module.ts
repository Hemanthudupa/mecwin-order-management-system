import { Op } from "sequelize";
import { AdvanceAmt } from "../advance_amt/model";
import { Order } from "../order/model";
import { APIError } from "../utils/Error";

export async function getAdvanceAmountPayedOrders() {
  try {
    const advAmt = await AdvanceAmt.findOne({
      where: {
        advanceAmt: process.env.advace_amt || "no advance amount",
      },
    });
    const orders = Order.findAll({
      where: {
        approved_by_accounts: false,
        payment_terms: {
          [Op.notIn]: [advAmt!.id],
        },
      },
    });
    return orders;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function accountsApproveOrder(id: string) {
  try {
    const order = await Order.findOne({ where: { id } });

    if (!order) throw new APIError(" invlaid order id ", " INVLAID ID ");
    order.set("approved_by_accounts", true);
    await order.save();
    return {
      message: " order approved by accounts successfully ",
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
