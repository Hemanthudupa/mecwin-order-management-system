import { Op, or } from "sequelize";
import { Distributor } from "../distributor/model";
import { Order } from "../order/model";
import { Product } from "../products/model";
import { User } from "../user/model";
import { APIError } from "../utils/Error";
import { Manager } from "./model";
import { Executive } from "../executives/model";
import { SalesExce_Order_Relation } from "../executives/sales-exe-orders-relation-model";
import {
  validateAssignStoresExecutive,
  validateSearchOptions,
  validatorAssignSalesExecutor,
} from "./validation";
import { object } from "joi";
import { StoresExe_Order_Relation } from "../executives/stores-exe-orders-relation-model";
import {
  order_status,
  product_status,
  sales_negotiation_status,
} from "../utils/constants";
import sequelize from "../database";

export async function getOrdersSales(
  managerId: string,
  userId: string,
  page: number,
  pageSize: number
) {
  try {
    const manager: any = await Manager.findOne({ where: { id: managerId } });
    let limit = pageSize;
    let offset = (page - 1) * pageSize;
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
      limit,
      offset,
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
  const transaction = await sequelize.transaction();
  try {
    const validatedSalesExecutive =
      await validatorAssignSalesExecutor.validateAsync({
        salesExecutivesId,
        orderId,
      });
    const order = await Order.findOne({
      where: {
        id: validatedSalesExecutive.orderId,
      },
      transaction,
    });
    const executive: any = await Executive.findOne({
      where: {
        id: validatedSalesExecutive.salesExecutivesId,
      },
      transaction,
    });
    if (!order) {
      throw new APIError("  invalid order id ", " INVALID ID ");
    }
    if (!executive) {
      throw new APIError("  invalid executive id ", " INVALID ID ");
    }

    const salesExe_order = await SalesExce_Order_Relation.create(
      {
        salesExecutivesId: executive.id,
        orderId: order.id as any,
      },
      { transaction }
    );
    // if (order.order_status.includes("") && order.order_status[0] == "") {
    //   let orderStatus = [];
    //   orderStatus.push(order_status.inProgress);
    //   order.order_status = orderStatus;
    //   let productStatus = [];
    //   productStatus.push(product_status.assigned);
    //   order.product_status = productStatus;
    // } else {
    let orderStatus = [...order.order_status];
    orderStatus.push(order_status.inProgress);
    console.log(orderStatus);

    let productStatus = [...order.product_status];

    productStatus.push(product_status.assigned);
    console.log(productStatus);

    order.set("order_status", orderStatus);
    order.set("product_status", productStatus);

    console.log(order.dataValues);
    // }

    const orders = await order.save({ logging: console.log, transaction });
    console.log(orders, " is the orders  ");
    await transaction.commit();
    return {
      message: " successfully  sales executive assigned to an order ",
      salesExe_order,
      orders,
    };
  } catch (error) {
    await transaction.rollback();
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

export async function getAllOrdersStores() {
  try {
    const order: any = await Order.findAll({
      where: {
        approved_by_sales: true,
        approved_by_stores: false,
        isActive: true,
      },
      attributes: ["id", "customerId", "deadLine", "quantity", "stores_status"],
      include: {
        model: Product,
        as: "products",
        attributes: ["product_name"],
      },
    });
    return {
      order,
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getStoresOrderById(id: string) {
  try {
    const order = await Order.findOne({
      where: { id },
      include: {
        model: Distributor,
        as: "customers",
        attributes: [
          "companyName",
          "gstNumber",
          "panNumber",
          "priorExperience",
          "fullName",
          "phoneNumber",
          "email",
          "shipping_Address",
          "shipping_Address_city",
          "shipping_Address_state",
          "shipping_Address_pincode",
          "billing_Address",
          "billing_Address_city",
          "billing_Address_state",
          "billing_Address_pincode",
        ],
      },
    });
    if (!order) throw new APIError("invlaid order id ", "INVALID ORDER ID");
    return order;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getAllStoresExecutives(managerId: string) {
  try {
    console.log(managerId);
    const manager = await Manager.findOne({
      where: {
        id: managerId,
      },
      attributes: ["id"],
      raw: true,
    });

    if (!manager)
      throw new APIError(" invalid manager id ", "INVALID MANAGER ID ");
    return await Executive.findAll({
      where: {
        managerId: manager.id,
      },
    });
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function assignStoresExecutiveOrder(data: any) {
  const validatedData = await validateAssignStoresExecutive.validateAsync(data);
  const order = await Order.findOne({ where: { id: validatedData.orderId } });
  if (!order) throw new APIError("invlaid order id ", "INVALID ORDER ID");
  order.stores_status = sales_negotiation_status.assigned;
  await order.save();

  console.log(validatedData);
  const storesData = await StoresExe_Order_Relation.create(validatedData);
  return {
    message: " successfully stores executive assigned ",
    storesData,
  };
  return { message: " successfully order assigned to the store executive " };
}
