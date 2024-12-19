import { Op } from "sequelize";
import { Cart } from "../cart/model";
import sequelize from "../database";
import { Order } from "../order/model";
import { Product } from "../products/model";
import { APIError } from "../utils/Error";
import { Distributor } from "./model";
import { orderDetails as oDetails } from "./validation";
import { SalesExce_Order_Relation } from "../executives/sales-exe-orders-relation-model";
import { tranform } from "../utils/transfroms";

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

export async function deleteCartItemById(id: string) {
  try {
    const cart = await Cart.findOne({
      where: { id },
    });
    if (!cart) {
      throw new APIError(" invlaid cart id ", " INVALID ID !!!");
    }
    await cart.destroy();
    return {
      message: " successfully product removed from the cart successfully ",
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getAllCartProducts(customerId: string, options: string) {
  try {
    if (options && options.toLowerCase() == "count") {
      const count = await Cart.count({
        where: {
          customerId,
        },
      });
      return {
        count,
      };
    } else if (options && options.toLowerCase() != "count") {
      throw new APIError(
        " invlaid options provided , it  should be count ",
        "INVALID OPTIONS "
      );
    }
    const cart: any = await Cart.findAll({
      where: {
        customerId,
      },
      attributes: [["id", "cartId"], "customerId", "quantity"],

      include: {
        model: Product,
        as: "products",
      },
    });
    const retunredCart: any = [];
    for (let ele of cart) {
      const newCart = Object.assign(ele);
      newCart.dataValues.productImages = [];
      for (let elememt of ele.products.product_image.split(";")) {
        newCart.dataValues.productImages.push(await tranform(elememt));
      }
      delete newCart.dataValues.products.dataValues.product_image;
      delete newCart.dataValues.products.dataValues.createdAt;

      delete newCart.dataValues.products.dataValues.updatedAt;

      delete newCart.dataValues.productId;
      delete newCart.dataValues.createdAt;

      delete newCart.dataValues.updatedAt;

      retunredCart.push(newCart);
    }
    return { data: retunredCart };
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

export async function getAllNegotiatedOrders(customerId: string) {
  try {
    return await Order.findAll({
      where: { customerId, sales_negotiation_status: "PENDING ACCEPTANCE" },
    });
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function acceptNegotiatedOrder(orderId: string) {
  try {
    const order = await Order.findOne({
      where: { id: orderId },
    });
    if (!order) throw new APIError(" invalid order id ", " INVALID ID ");
    order.sales_negotiation_status = "NEGOTIATED";
    await order.save();
    const salesOrd = await SalesExce_Order_Relation.findOne({
      where: {
        orderId,
      },
    });
    if (!salesOrd) throw new APIError(" invalid order id ", " INVALID ID ");

    salesOrd.isActive = false;

    await salesOrd.save();
    return {
      message: " customer happy with the negotiated money ",
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getProductByIdImages(product_image: string) {
  try {
    // const product: any = await Product.findOne({
    //   where: {
    //     id,
    //   },
    // });
    // if (!product) throw new APIError(" invlaid product id ", " INVALID ID ");

    const images = product_image.split(";");
    let product: any = "";
    for (let ele of images) {
      const data = await tranform(ele);
      product = data;
    }
    return product;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
