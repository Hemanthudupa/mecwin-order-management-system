import { Op } from "sequelize";
import { User } from "../user/model";
import csv from "csvtojson";
import { compare, hash } from "bcrypt";
import { APIError } from "./Error";
import { sign, verify } from "jsonwebtoken";
export async function runSeedUsers() {
  try {
    if ((await UserRole.findAll()).length > 0) {
      const data = await csv().fromFile("./seedusers.csv");
      const phoneNumber = data.map((ele, ind) => ele.phoneNumber);

      const email = data.reduce(
        (acc, ele, ind) => {
          acc.data.push({ ele, ind });
          return acc;
        },
        {
          data: [],
        }
      );

      let users: any = await User.findAll({
        where: {
          [Op.or]: [
            {
              email: {
                [Op.in]: email.data.map((ele: any) => ele.ele.email),
              },
            },
            {
              phoneNumber: {
                [Op.in]: phoneNumber,
              },
            },
          ],
        },
        attributes: ["email"],
      });

      users = users.map((ele: any) => {
        return ele.dataValues.email;
      });
      let newData: any = [];
      for (let ele of email.data) {
        if (!users.includes(ele.ele.email)) {
          data[ele.ind].password = await hashPassword(data[ele.ind].password);
          const userRole = await UserRole.findOne({
            where: {
              userRole: data[ele.ind].userRole,
            },
            attributes: ["id"],
          });

          if (!userRole) {
            throw new APIError(
              "user role is not valid ",
              " INVALID USER ROLE "
            );
          }
          data[ele.ind].userRole = userRole.dataValues.id;
          newData.push(data[ele.ind]);
        } else if (ele.ind == email.data.length - 1) {
          console.log("all users are already uploaded ");
        }
      }
      const usersData = await User.bulkCreate(newData);
      if (usersData.length > 0) {
        console.log(" user created successfully ");
      }
    } else {
      console.log("add roles manually to run seed files ");
    }
  } catch (error) {
    console.log((error as any).message);
    console.log("seed files have problem to run ", (error as Error).stack);
  }
}

export async function hashPassword(password: string) {
  try {
    const hashedPassword = await hash(password, 11);
    return hashedPassword;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  try {
    return await compare(password, hashedPassword);
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export function generateJWTToken(user: User) {
  try {
    return sign(
      {
        id: user.id,
        userName: user.userName,
        email: user.email,
        userRole: user.userRole,
        phoneNumber: user.phoneNumber,
      },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: process.env.JWT_EXPIRATION_TIME! + "d",
      }
    );
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
import { NextFunction, Request, Response } from "express";
import { USER_ROLES } from "./constants";
import { UserRole } from "../roles/model";
import { Distributor } from "../distributor/model";

export async function ensureUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.headers.authorization) {
      throw new APIError("JWT token required ");
    }
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new APIError("invalid JWT token ");
    }
    const payload: any = verify(token, process.env.JWT_SECRET_KEY!);

    const { userRole }: any = await UserRole.findOne({
      where: {
        id: payload.userRole,
      },
      attributes: ["userRole"],
    });
    payload.userRole = userRole;
    (req as any).user = payload;
    next();
  } catch (error) {
    next(error);
  }
}
export async function ensureAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    if (user.userRole == USER_ROLES.admin) {
      next();
    } else {
      throw new APIError(
        "only admin can perform this action ",
        " INVALID USER ROLE "
      );
    }
  } catch (error) {
    next(error);
  }
}
export async function ensureDistributor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userRole, id } = (req as any).user;
    if (userRole.toUpperCase() == "DISTRIBUTOR") {
      const dist = await Distributor.findOne({ where: { userId: id } });
      (req as any).user.distributorId = dist!.id;
      next();
    } else {
      throw new APIError(
        " only distributor can perform this action ",
        " INVALID ROLE "
      );
    }
  } catch (error) {
    next(error);
  }
}
