import { Op } from "sequelize";
import sequelize from "../database";
import { Distributor } from "../distributor/model";
import { validateDistributor } from "../distributor/validation";
import { Product } from "../products/model";
import { Product_Categoary } from "../products/product_category_model";
import { Product_Image } from "../products/product_image_model";
import { UserRole } from "../roles/model";
import { distributor, productCategoary, userRole } from "../types";
import { User } from "../user/model";
import { hashPassword } from "../utils/authentication";
import { USER_ROLES } from "../utils/constants";
import { APIError } from "../utils/Error";
import { unlink } from "fs";
import {
  validation_Product_Categoary,
  validation_product_details,
  validation_User_Role,
} from "./validation";

export async function createDistributor(data: distributor) {
  const transaction = await sequelize.transaction();

  try {
    const validDist = await validateDistributor.validateAsync(data);
    const where: any = {
      [Op.or]: [],
    };

    if (validDist.emailId) {
      where[Op.or].push({ emailId: validDist.emailId });
    }
    if (validDist.phoneNumber) {
      where[Op.or].push({ phoneNumber: validDist.phoneNumber });
    }

    const user = await User.findOne({
      where,
    });
    if (user) {
      unlink(data.attachments, (err) => {
        if (err) {
          console.log("error came while deleting the distributor files ");
        } else {
          console.log("File deleted successfully!");
        }
      });
      throw new APIError(
        "duplicate email or phone number ",
        " DUPLICATE DATA "
      );
    }
    const userData = await User.create(
      {
        email: validDist.email,
        isActive: true,
        password: await hashPassword(validDist.password),
        phoneNumber: validDist.phoneNumber,
        userName: validDist.fullName,
        userRole: USER_ROLES.distributor,
      },
      { transaction }
    );

    validDist.userId = userData.id;
    validDist.password = await hashPassword(validDist.password);
    const dist = await Distributor.create(
      validDist,

      { transaction }
    );
    await transaction.commit();

    return {
      message: "distributor created successfully ",
    };
  } catch (error) {
    transaction.rollback();
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function addUserRole(roles: userRole) {
  try {
    const validRole = await validation_User_Role.validateAsync(roles);

    const userRole = await UserRole.create(validRole);

    return {
      data: userRole,
      message: "successfully created user role ",
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function addProductCategoary(details: productCategoary) {
  try {
    const validatedDetails = await validation_Product_Categoary.validateAsync(
      details
    );
    const productCategoaryDetails = await Product_Categoary.create(
      validatedDetails
    );
    return {
      data: productCategoaryDetails,
      message: "product categoary successfully added ",
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function addProductDetails(product_details: any) {
  try {
    const validatedDetails = await validation_product_details.validateAsync(
      product_details
    );

    const product = await Product.create(validatedDetails);
    return {
      message: " product added successfully ",
      product,
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getAllProducts() {
  try {
    return await Product.findAll({
      raw: true,
    });
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
export async function addProductImages(id: any, savedImagesPaths: string) {
  try {
    const imageData = await Product_Image.create({
      productId: id,
      product_image: savedImagesPaths,
    });
    return {
      message: " image successfully added ",
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
