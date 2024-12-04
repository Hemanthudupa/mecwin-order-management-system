import { Op } from "sequelize";
import { Cart } from "../cart/model";
import sequelize from "../database";
import { Order } from "../order/model";
import { Product } from "../products/model";
import { APIError } from "../utils/Error";
import { Distributor } from "./model";
import { orderDetails as oDetails } from "./validation";

export async function addProductsToCart(
  productId: any,
  quantity: number,
  distributorId: string
) {
  try {
    const dist: any = await Distributor.findOne({
      where: {
        id: distributorId,
      },
    });
    if (!dist) {
      throw new APIError(" invlaid distributor id ", " INVALID ID ");
    }
    const product = await Product.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new APIError(" invalid product ID ", " INVALID ID ");
    }
    const cart = await Cart.create({
      customerId: dist.id,
      productId,
      quantity,
    });
    return {
      message: "product successfully added to cart ",
      cart: cart.dataValues,
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getAllCartProducts(customerId: string) {
  try {
    const cart = await Cart.findAll({
      where: {
        customerId,
      },
      include: {
        model: Product,
        as: "products",
      },
    });
    return { data: cart };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function placeCartOrders(
  distributorId: string,
  orderDetails: any
) {
  const transaction = await sequelize.transaction();
  try {
    const validatedOrderDetails = await oDetails.validateAsync(orderDetails);

    const dist = await Distributor.findOne({
      where: {
        id: distributorId,
      },
    });

    if (!dist) {
      throw new APIError("invlaid distributor id ", " INVALID ID ");
    }

    const cart = await Cart.findAll({
      where: {
        customerId: distributorId,
      },
      include: {
        model: Product,
        as: "products",
      },
    });

    const orders: any = [];
    for (let ele of cart) {
      const orderTemp: any = {};

      /*
  declare reason: CreationOptional<string>;
  declare discount: CreationOptional<number>;
  declare remarks: CreationOptional<string>;
  declare salesExecutive: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
      */
      orderTemp["customerId"] = ele.customerId;
      orderTemp["productId"] = ele.productId;
      orderTemp["quantity"] = ele.quantity;

      if (
        validatedOrderDetails.shipping_Address &&
        validatedOrderDetails.shipping_Address != null
      ) {
        orderTemp["shipping_Address"] = validatedOrderDetails.shipping_Address;
      } else {
        orderTemp["shipping_Address"] = dist.shipping_Address;
      }

      if (
        validatedOrderDetails.billing_Address &&
        validatedOrderDetails.billing_Address != null
      ) {
        orderTemp["billing_Address"] = validatedOrderDetails.billing_Address;
      } else {
        orderTemp["billing_Address"] = dist.billing_Address;
      }

      orderTemp["remarks"] = validatedOrderDetails.remarks;
      orderTemp["price"] =
        (
          await Product.findOne({
            where: { id: ele.productId as any },
          })
        )?.dataValues.price! * ele.quantity;
      orders.push(orderTemp);
    }

    const createdOrders = await Order.bulkCreate(orders, { transaction });

    console.log(createdOrders, " are the order created bulk report ");

    const deletedCart = await Cart.destroy({
      where: {
        id: { [Op.in]: cart.map((ele) => ele.id) },
      },
    });

    if (deletedCart) {
      console.log("cart deleted successfully ");
    }
    await transaction.commit();

    if (createdOrders.length > 0) {
      return {
        message: " successfully created order ",
        createdOrders,
      };
    } else {
      return {
        message: "   order not created  because orders are 0 ",
      };
    }
  } catch (error) {
    await transaction.rollback();
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
