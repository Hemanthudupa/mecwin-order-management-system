import { Op } from "sequelize";
import { AdvanceAmt } from "../advance_amt/model";
import { Order } from "../order/model";
import { APIError } from "../utils/Error";

export async function getAllOrders() {
  try {
    const advanceAmt = await AdvanceAmt.findOne({
      where: {
        advanceAmt: process.env.advace_amt || "no advance amount",
      },
      raw: true,
      attributes: ["id"],
    });

    const orders = await Order.findAll({
      where: {
        [Op.or]: [
          { payment_terms: advanceAmt?.id },
          {
            [Op.and]: [
              { approved_by_accounts: true },
              {
                payment_terms: {
                  [Op.not]: advanceAmt?.id,
                },
              },
            ],
          },
        ],
      },
      //   logging: true,
    });
    return orders;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
