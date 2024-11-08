import { Op, Transaction } from "sequelize";
import sequelize from "../database";
import { Distributor } from "../distributor/model";
import { validateDistributor } from "../distributor/validation";
import { Product } from "../products/model";
import { Product_Categoary } from "../products/product_category_model";
import { UserRole } from "../roles/model";
import { distributor, productCategoary, userRole } from "../types";
import { User } from "../user/model";
import { hashPassword } from "../utils/authentication";
import { USER_ROLES } from "../utils/constants";
import { APIError } from "../utils/Error";
import { readFileSync, unlink } from "fs";
import {
  createExecutiveValidation,
  createManagerValidation,
  createUserDetails,
  validation_Product_Categoary,
  validation_product_details,
  validation_User_Role,
} from "./validation";
import { Manager } from "../managers/model";
import { Executive } from "../executives/model";

export async function createDistributor(data: distributor) {
  const transaction = await sequelize.transaction();

  try {
    const validDist = await validateDistributor.validateAsync(data);
    const where: any = {
      [Op.or]: [],
    };
    console.log("1 ");
    if (validDist.email) {
      where[Op.or].push({ email: validDist.email });
    }
    if (validDist.phoneNumber) {
      where[Op.or].push({ phoneNumber: validDist.phoneNumber });
    }
    console.log(" 2 ");

    const user: any = await User.findOne({
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

    const userRole: any = await UserRole.findOne({
      where: {
        userRole: "DISTRIBUTOR",
      },
      attributes: ["id"],
    });

    const userData = await User.create(
      {
        email: validDist.email,
        isActive: true,
        password: await hashPassword(validDist.password),
        phoneNumber: validDist.phoneNumber,
        userName: validDist.fullName,
        userRole: userRole.id,
      },
      { transaction }
    );

    validDist.userId = userData.dataValues.id;
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
    await transaction.rollback();
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function addUserRole(roles: userRole) {
  try {
    const validRole = await validation_User_Role.validateAsync(roles);

    const role = await UserRole.findOne({
      where: {
        userRole: validRole.userRole,
      },
    });

    if (role) {
      throw new APIError(" user role already present ", " DUPLICATE ROLE ");
    }
    const userRole = await UserRole.create(validRole);

    return {
      data: userRole,
      message: "successfully created user role ",
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getAllUserRoles(options: string) {
  try {
    const where: any = {};
    if (options) {
      options = options.toUpperCase();
      if (Object.values(USER_ROLES).includes(options)) {
        where["userRole"] = options;
      } else {
        throw new APIError(
          ` options should contains valid user roles  ${options}`,
          " INVALID USER ROLE "
        );
      }
    }
    return await UserRole.findAll({
      where,
    });
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

    const prodCat = await Product_Categoary.findOne({
      where: {
        id: validatedDetails.product_categoary,
      },
    });

    if (!prodCat) {
      throw new APIError(" invlaid product categoary ", " INVALID ID ");
    }

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
    const products = await Product.findAll({
      raw: true,
    });

    return products.map((ele) => {
      const buffer = readFileSync(ele.product_image.split(";")[0]);
      ele.product_image = `data:image/jpeg;base64,${buffer.toString("base64")}`; //pass product_image inside the img tag of react
      return ele;
    });
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
export async function addProductImages(id: any, savedImagesPaths: string) {
  try {
    const product = await Product.findOne({
      where: {
        id,
      },
    });
    product?.set("product_image", savedImagesPaths);
    await product?.save();
    return {
      message: " image successfully added ",
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

// export async function getAllProductImages(id: string) {
//   try {
//     await Product.findOne({ where: { id } });
//   } catch (error) {
//     throw new APIError((error as APIError).message, (error as APIError).code);
//   }
// }

export async function getAllProductsCategoray() {
  try {
    const productsCategoary = await Product_Categoary.findAll({
      attributes: ["id", "categoary_type"],
    });
    return productsCategoary;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function removeProductImage(id: string) {
  try {
    const product: any = await Product.findOne({
      where: {
        id,
      },
    });
    if (!product.product_image) {
      throw new APIError("products have no images ", "NO IMAGES FOUND ");
    }
    product.product_image.split(";").forEach((ele: any) => {
      unlink(ele, (err) => {
        console.log(err?.message, err?.code, " image doesnot removed");
      });
    });
    product?.set("product_image", null);
    await product.save();
    return {
      message: "product images successfully removed ",
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function createManager(data: any) {
  const transaction = await sequelize.transaction();

  try {
    const validatedManagerData = await createManagerValidation.validateAsync(
      data
    );
    const userData = {
      userName: validatedManagerData.userName,
      userRole: validatedManagerData.userRole,
      password: validatedManagerData.password,
      email: validatedManagerData.email,
      phoneNumber: validatedManagerData.phoneNumber,
    };
    const { user } = await createUser(userData, transaction);
    const managerData: any = {
      employeeId: validatedManagerData.employeeId,
      work_locations: validatedManagerData.work_locations,
      userName: validatedManagerData.userName,
      userId: user.dataValues.id,
      department: validatedManagerData.department,
    };

    const manager = await Manager.create(managerData, {
      transaction,
    });
    await transaction.commit();
    return { message: " successfully manager created " };
  } catch (error) {
    await transaction.rollback();
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
export async function createUser(data: any, transaction: Transaction) {
  try {
    const userData = await createUserDetails.validateAsync(data);
    userData.password = await hashPassword(userData.password);

    const userRole = await UserRole.findOne({
      where: {
        id: data.userRole,
      },
    });
    if (!userRole) {
      throw new APIError(
        " invalid user role in request body ",
        " INVALID ROLE "
      );
    }

    const dataFromDb = await User.findOne({
      where: {
        [Op.or]: [
          {
            userName: userData.userName,
          },
          {
            email: userData.email,
          },
        ],
      },
    });
    if (dataFromDb) {
      throw new APIError(
        " duplicate properties email or phone number already registerd ",
        " DUPLICATE PROPERTIES"
      );
    }
    const user = await User.create(userData, { transaction });
    return { message: " user created successfully ", user };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getAllManagers(options: string) {
  try {
    const where: any = {};
    if (options) {
      options = options.toUpperCase();
      where.department = options;
    }
    const managers = await Manager.findAll({
      where,

      include: {
        model: User,
        as: "user",
        where: {
          isActive: true,
        },
      },
    });
    return managers;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function deleteManagerByID(id: string) {
  try {
    const manager: any = await Manager.findOne({
      where: { id },
      include: {
        model: User,
        as: "user",
        where: { isActive: true },
      },
    });
    if (!manager) {
      throw new APIError(
        " invlaid manager id or manager already deleted  ",
        "INVALID ID "
      );
    }
    manager.user.isActive = false;
    await manager.user.save();
    return { message: " manager successfully deleted " };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function addSalesExecutives(body: any) {
  const transaction = await sequelize.transaction();
  try {
    const validatedExecutive = await createExecutiveValidation.validateAsync(
      body
    );
    const user = {
      userName: validatedExecutive.userName,
      phoneNumber: validatedExecutive.userName,
      email: validatedExecutive.email,
      userRole: validatedExecutive.userRole,
      password: await hashPassword(validatedExecutive.password),
    };

    const foundEmail = await User.findOne({
      where: {
        [Op.or]: [
          {
            phoneNumber: validatedExecutive.phoneNumber,
          },
          {
            email: validatedExecutive.email,
          },
        ],
      },
    });

    if (foundEmail) {
      throw new APIError(
        " dupliate email or phone number ",
        " DUPLICATE PROPERTIES "
      );
    }
    const userDetails: any = await User.create(user, { transaction });

    const sales = {
      employeeId: validatedExecutive.employeeId,
      location: validatedExecutive.location,
      managerId: validatedExecutive.managerId,
      userName: validatedExecutive.userName,
      userId: userDetails.id,
    };

    await Executive.create(sales, { transaction });
    await transaction.commit();
    return {
      message: " sales executive added successfully ",
    };
  } catch (error) {
    await transaction.rollback();
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getAllSalesExecutives(options: string) {
  try {
    const where: any = {};
    if (options) {
      options = options.toUpperCase();
      where.department = options;
    }

    return await Executive.findAll({
      include: [
        {
          model: User,
          as: "user",
          where: {
            isActive: true,
          },
        },
        {
          model: Manager,
          as: "manager",
          where,
        },
      ],
    });
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function deleteServiceExecutive(id: string) {
  try {
    const executive: any = await Executive.findOne({
      where: { id },
      include: {
        model: User,
        as: "user",
        where: {
          isActive: true,
        },
      },
    });
    if (!executive)
      throw new APIError(" invlaid service executive  id ", " INVALID ID ");

    executive.user.isActive = false;
    await executive.user.save();
    return {
      message: " service executive deleted successfully ",
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
