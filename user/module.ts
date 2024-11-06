import { Op } from "sequelize";
import { Distributor } from "../distributor/model";
import { validateDistributor } from "../distributor/validation";
import { distributor } from "../types";
import { unlink } from "fs";
import {
  comparePassword,
  generateJWTToken,
  hashPassword,
} from "../utils/authentication";
import { APIError } from "../utils/Error";
import { User } from "./model";
import { loginValidation } from "./validation";
import { USER_ROLES } from "../utils/constants";
import sequelize from "../database";
import { UserRole } from "../roles/model";

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
