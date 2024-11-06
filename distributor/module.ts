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

    const orders = cart.map((ele) => {
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

      return orderTemp;
    });

    await Order.bulkCreate(orders, { transaction });

    return {
      message: " successfully created order ",
    };
  } catch (error) {
    transaction.rollback();
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
