import { Cart } from "../cart/model";
import { Product } from "../products/model";
import { APIError } from "../utils/Error";
import { Distributor } from "./model";

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
