import { Op } from "sequelize";
import { Distributor } from "../distributor/model";
import { validateDistributor } from "../distributor/validation";
import { distributor, userRole } from "../types";
import { unlink } from "fs";
import {
  comparePassword,
  generateJWTToken,
  hashPassword,
} from "../utils/authentication";
import { APIError } from "../utils/Error";
import { User } from "./model";
import { loginValidation } from "./validation";
import { UserRole } from "../roles/model";
import sequelize from "../database";
import { validation_User_Role } from "../admin/validation";

export async function login(
  email: string,
  phoneNumber: string,
  password: string
) {
  try {
    const validatedLogin = await loginValidation.validateAsync({
      email,
      phoneNumber,
      password,
    });

    console.log(validatedLogin);

    const where: any = {};
    if (email) {
      where["email"] = email;
    }
    if (phoneNumber) {
      where["phoneNumber"] = phoneNumber;
    }
    if (!(Object.keys(where).length > 0)) {
      throw new APIError(
        "either phone number or email are required ",
        " INVALID INPUTS "
      );
    }
    const user = await User.findOne({ where });
    console.log(user);
    if (!user) {
      throw new APIError("user doesnot exist ", "USER DOESNOT EXIST");
    }
    const res = await comparePassword(password, user!.password);
    if (res) {
      const { userRole }: any = await UserRole.findOne({
        where: {
          id: user.userRole,
        },
        attributes: ["userRole"],
        raw: true,
      });
      return {
        token: generateJWTToken(user),
        userRole,
      };
    } else {
      console.log(password, user.password);
      throw new APIError("invalid password ", "INVALID PASSWORD");
    }
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

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
    if (!userRole) {
      throw new APIError(
        " distributor user role is not there ",
        " INVALID USER ROLE "
      );
    }

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

    const dist = await Distributor.create(validDist, { transaction });
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
