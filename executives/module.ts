import { literal, Op } from "sequelize";
import { Order } from "../order/model";
import { APIError } from "../utils/Error";
import { SalesExce_Order_Relation } from "./sales-exe-orders-relation-model";
import { Executive } from "./model";
import {
  validateLineItemsData,
  validateOrderUpdateDetails,
  validateScanningData,
} from "./validation";
import sequelize from "../database";
import { StoresExe_Order_Relation } from "./stores-exe-orders-relation-model";
import { UserRole } from "../roles/model";
import { ScannedProducts } from "../scanned_products/model";
import { Product } from "../products/model";
import { sales_negotiation_status } from "../utils/constants";
import { LineItems } from "../line_items/model";

export async function getSalesExecutiveOrders(
  id: string,
  from: string,
  to: string,
  time: string,
  page: number,
  pageSize: number
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
      } else if (time == "today") {
        whereCondition.createdAt = {
          [Op.gte]: date,
        };
      } else
        throw new APIError(
          " invalid time , pass time as month , today , week ",
          " INVALID INPUT "
        );
    }

    let limit = pageSize;
    let offset = (page - 1) * pageSize;

    const salesExe = await SalesExce_Order_Relation.findAll({
      where: {
        isActive: true,
        salesExecutivesId: id,
        ...whereCondition,
      },
      include: {
        model: Order,
        as: "orders",
      },
      limit,
      offset,
    });

    // return await Order.findAll({
    //   where: {
    //     id: { [Op.in]: salesExe.map((ele) => ele.orderId as any) },
    //   },
    // });
    return salesExe;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function updateOrderDetails(info: any) {
  try {
    const validatedOrderDetials =
      await validateOrderUpdateDetails.validateAsync(info);

    const order = await Order.findOne({
      where: { id: validatedOrderDetials.orderId },
    });
    console.log(validatedOrderDetials.orderId);
    if (!order) throw new APIError("invalid order id", " INVALID ID ");
    order.payment_terms = validatedOrderDetials.payment_terms;
    order.diameter = validatedOrderDetials.diameter;
    order.headSize = validatedOrderDetials.headSize;
    order.motorType = validatedOrderDetials.motorType;
    order.current = validatedOrderDetials.current;
    order.pannelType = validatedOrderDetials.pannelType;
    order.spd = validatedOrderDetials.spd;
    order.data = validatedOrderDetials.data;
    order.warranty = validatedOrderDetials.warranty;
    order.transportation = validatedOrderDetials.transportation;
    order.approved_by_sales = true;
    order.sales_negotiation_status =
      sales_negotiation_status.pending_acceptance;
    await order.save();

    return { message: " order updated successfully" };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getOrdersByDays(
  options: string,
  from: string,
  to: string,
  searchById: string
) {
  try {
    const where: any = { isActive: true };
    const whereCondition: any = { approved_by_sales: false };
    if (options) {
      let date = new Date();
      if (options.toLowerCase() == "today") {
        date.setUTCHours(0, 0, 0, 1);
        where.createdAt = { [Op.gte]: date };
      } else if (options.toLowerCase() == "week") {
        date.setUTCHours(0, 0, 0, 1);
        const day = date.getUTCDay();
        date.setUTCDate(date.getUTCDate() - day);
        where.createdAt = { [Op.gte]: date };
      } else {
        date.setUTCHours(0, 0, 0, 1);
        date.setUTCDate(1);
        console.log(date);
        where.createdAt = { [Op.gte]: date };
      }
    } else if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setUTCHours(23, 59, 59, 59);
      where.createdAt = {
        [Op.gte]: fromDate,
        [Op.lte]: toDate,
      };
    } else if (searchById) {
      whereCondition.id = literal(`CAST (ID AS TEXT) LIKE '%${searchById}%'`);
    }

    return await SalesExce_Order_Relation.findAll({
      where,
      include: {
        model: Order,
        as: "orders",
        where: whereCondition,
      },
    });
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getAllStoresExecutiveOrders(executiveId: string) {
  try {
    const storesExecuitve = await StoresExe_Order_Relation.findAll({
      where: {
        storesExecutivesId: executiveId,
        isActive: true,
        isUnderProcess: true,
      },
      include: {
        model: Order,
        as: "orders",
        attributes: ["deadLine"],
      },
    });
    return storesExecuitve;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getStoreExecutiveOrderById(orderId: string) {
  try {
    const order = await StoresExe_Order_Relation.findOne({
      where: {
        orderId,
      },
      include: {
        model: Order,
        as: "orders",
      },
    });
    if (!order) throw new APIError(" invlaid order id ", "INVALID ID ");
    return order;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function searchStoresExecutiveOrders(
  options: string,
  from: string,
  to: string,
  searchById: string
) {
  try {
    const where: any = { isActive: true };
    const whereCondition: any = { approved_by_sales: true };
    if (options) {
      let date = new Date();
      if (options.toLowerCase() == "today") {
        date.setUTCHours(0, 0, 0, 1);
        where.createdAt = { [Op.gte]: date };
      } else if (options.toLowerCase() == "week") {
        date.setUTCHours(0, 0, 0, 1);
        const day = date.getUTCDay();
        date.setUTCDate(date.getUTCDate() - day);
        where.createdAt = { [Op.gte]: date };
      } else {
        date.setUTCHours(0, 0, 0, 1);
        date.setUTCDate(1);
        console.log(date);
        where.createdAt = { [Op.gte]: date };
      }
    } else if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setUTCHours(23, 59, 59, 59);
      where.createdAt = {
        [Op.gte]: fromDate,
        [Op.lte]: toDate,
      };
    } else if (searchById) {
      whereCondition.id = literal(`CAST (ID AS TEXT) LIKE '%${searchById}%'`);
    }

    return await StoresExe_Order_Relation.findAll({
      where,
      include: {
        model: Order,
        as: "orders",
        where: whereCondition,
      },
    });
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
export async function scannedProducts(userRole: string, data: any) {
  try {
    const validatedScanningData = await validateScanningData.validateAsync(
      data
    );

    if (
      !(validatedScanningData.totalScanned < validatedScanningData.netQuantity)
    ) {
      throw new APIError(
        " cannot add more products on this order ",
        " ORDER LIMIT REACHED !!!"
      );
    }
    if (userRole == "STORES EXECUTIVE") {
      const scannedProduct = await ScannedProducts.create({
        productId: validatedScanningData.productId,
        stores_unit_unique_id: validatedScanningData.unitUniqueId,
        current: validatedScanningData.current,
        motorHp: validatedScanningData.motorHp,
        headSize: validatedScanningData.headSize,
        productName: validatedScanningData.productName,
      });
      return { message: " product Scanned Successfully by Stores team" };
    } else if (userRole == "WINDING EXECUTIVE") {
      await sequelize.transaction(async (t) => {
        const scannedProduct = await ScannedProducts.findOne({
          where: {
            productId: validatedScanningData.productId,
            winding_unit_unique_id: { [Op.is]: null } as any,
          },
          limit: 1,
          offset: 0,
          order: ["createdAt", "ASC"],
          transaction: t,
          lock: t.LOCK.UPDATE,
          skipLocked: true,
        });

        if (!scannedProduct)
          throw new APIError(
            " invalid product id or products scanned completed ",
            "ORDER  PRODUCT NOT FOUND "
          );
        scannedProduct!.winding_unit_unique_id =
          validatedScanningData.unitUniqueId;
        await scannedProduct?.save({ transaction: t });
        return { message: "successfully  winding team scanned the  product " };
      });
    } else if (userRole == "ASSEMBLY EXECUTIVE") {
      await sequelize.transaction(async (t) => {
        const scannedProduct = await ScannedProducts.findOne({
          where: {
            productId: validatedScanningData.productId,
            assembly_unit_unique_id: { [Op.is]: null } as any,
          },
          limit: 1,
          offset: 0,
          order: ["createdAt", "ASC"],
          transaction: t,
          lock: t.LOCK.UPDATE,
          skipLocked: true,
        });

        if (!scannedProduct)
          throw new APIError(
            "  invalid product id or products scanned completed  ",
            "ORDER  PRODUCT NOT FOUND "
          );
        scannedProduct!.assembly_unit_unique_id =
          validatedScanningData.unitUniqueId;
        await scannedProduct?.save({ transaction: t });
        return { message: "successfully  winding team scanned the  product " };
      });
    } else if (userRole == "TESTING EXECUTIVE") {
      await sequelize.transaction(async (t) => {
        const scannedProduct = await ScannedProducts.findOne({
          where: {
            productId: validatedScanningData.productId,
            assembly_unit_unique_id: { [Op.is]: null } as any,
          },
          limit: 1,
          offset: 0,
          order: ["createdAt", "ASC"],
          transaction: t,
          lock: t.LOCK.UPDATE,
          skipLocked: true,
        });

        if (!scannedProduct)
          throw new APIError(
            " invalid product id or products scanned completed  ",
            "ORDER  PRODUCT NOT FOUND "
          );
        scannedProduct!.assembly_unit_unique_id =
          validatedScanningData.unitUniqueId;
        await scannedProduct?.save({ transaction: t });
        return { message: "successfully  winding team scanned the  product " };
      });
    } else if (userRole == "PACKING EXECUTIVE") {
      await sequelize.transaction(async (t) => {
        const scannedProduct = await ScannedProducts.findOne({
          where: {
            productId: validatedScanningData.productId,
            packing_unit_unique_id: { [Op.is]: null } as any,
          },
          limit: 1,
          offset: 0,
          order: ["createdAt", "ASC"],
          transaction: t,
          lock: t.LOCK.UPDATE,
          skipLocked: true,
        });

        if (!scannedProduct)
          throw new APIError(
            "  invalid product id or products scanned completed  ",
            "ORDER  PRODUCT NOT FOUND "
          );
        scannedProduct!.packing_unit_unique_id =
          validatedScanningData.unitUniqueId;
        await scannedProduct?.save({ transaction: t });
        return { message: "successfully  winding team scanned the  product " };
      });
    } else if (userRole == "QC EXECUTIVE") {
      await sequelize.transaction(async (t) => {
        const scannedProduct = await ScannedProducts.findOne({
          where: {
            productId: validatedScanningData.productId,
            qc_unit_unique_id: { [Op.is]: null } as any,
          },
          limit: 1,
          offset: 0,
          order: ["createdAt", "ASC"],
          transaction: t,
          lock: t.LOCK.UPDATE,
          skipLocked: true,
        });

        if (!scannedProduct)
          throw new APIError(
            "  invalid product id or products scanned completed ",
            "ORDER  PRODUCT NOT FOUND "
          );
        scannedProduct!.qc_unit_unique_id = validatedScanningData.unitUniqueId;
        await scannedProduct?.save({ transaction: t });
        return { message: "successfully  winding team scanned the  product " };
      });
    }
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getCustomersRejectedOrders(salesExeId: string) {
  try {
    const order = await SalesExce_Order_Relation.findOne({
      where: {
        salesExecutivesId: salesExeId,
        isActive: true,
      },

      include: {
        model: Order,
        as: "orders",
        where: {
          sales_negotiation_status: sales_negotiation_status.rejected,
        },
      },
    });

    return {
      message: " successfully fetched rejected orders ",
      salesExeOrders: order,
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function addLineItems(data: any[]) {
  const transaction = await sequelize.transaction();
  try {
    if (Array.isArray(data) && data.length > 0) {
      for (let ele of data) {
        const validatedData = await validateLineItemsData.validateAsync(ele);
      }

      const order = await Order.findOne({
        where: { id: data[0].orderId },
      });

      if (!order) throw new APIError(" invalid order id ", " INVLAID ID ");
      const finalData = data.reduce(
        (acc, ele) => {
          acc.price += Number(ele.price);
          acc.quantity += Number(ele.quantity);
          return acc;
        },
        {
          price: 0,
          quantity: 0,
        }
      );

      const lineItems = await LineItems.bulkCreate(data, {
        transaction,
      });

      order!.quantity = finalData.quantity;
      order!.price = finalData.price;
      order!.sales_negotiation_status =
        sales_negotiation_status.pending_acceptance;
      order!.approved_by_sales = true;
      await order?.save({ transaction });
      await transaction.commit();
      return { message: " successfully created line items " };
    } else {
      await transaction.rollback();
      throw new APIError(
        " input data should be an array ",
        " invlaid data type "
      );
    }
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
