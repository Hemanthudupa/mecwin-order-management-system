import { Op } from "sequelize";
import { AdvanceAmt } from "../advance_amt/model";
import { Order } from "../order/model";
import { APIError } from "../utils/Error";
import { validateAddDeadline } from "./validation";
import { LineItems } from "../line_items/model";
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
      attributes: [
        ["id", "orderId"],
        "customerId",
        "order_status",
        "price",
        "deadLine",
      ],
      // include: {
      //   model: LineItems,
      //   as: "lineItems",
      // },
      //   logging: true,
    });
    return orders;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function addDeadLineToOrdersByPlanning(data: any[]) {
  try {
    if (!Array.isArray(data))
      throw new APIError(
        " input field should be an array of objects ",
        " INVALID FORMAT "
      );
    const valdiatedDataFirst: any = await validateAddDeadline.validateAsync(
      data[0]
    );
    const order = await Order.findOne({
      where: {
        id: valdiatedDataFirst.orderId,
        isActive: true,
      },
    });

    if (!order) throw new APIError(" invlaid order id ", " INVALID ORDER ID ");
    let maxDate: any = new Date(0).toISOString();

    for (let i = 0; i < data.length; i++) {
      const valdiatedData: any = await validateAddDeadline.validateAsync(
        data[i]
      );

      let newDate = new Date(valdiatedData.deadLine).toISOString();

      if (maxDate < newDate) {
        maxDate = newDate;
        console.log(newDate);
        console.log(maxDate);
      } else {
        console.log(" date is lesser than the expected ");
      }
      const lineItem = await LineItems.findOne({
        where: { id: valdiatedData.id },
      });
      if (!lineItem)
        throw new APIError(" invlaid line item id ", " INVLAID LINE ITEM ID ");
      lineItem?.set("deadLine", new Date(valdiatedData.deadLine).toISOString());
      console.log(lineItem.deadLine, " is the dead line ");
      await lineItem?.save();
    }
    let date = new Date(maxDate);
    date.setHours(23, 59, 59, 59);
    order.set("deadLine", date);
    order.approved_by_planning = true;
    await order.save();

    return {
      message: " successfully deadline added to the order ",
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getPlanningOrdersById(id: string) {
  try {
    const order = await Order.findOne({
      where: { id },
      include: {
        model: LineItems,
        as: "order_Id",
      },
    });
    return order;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
