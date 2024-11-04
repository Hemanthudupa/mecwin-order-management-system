import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  STRING,
  UUID,
  UUIDV4,
} from "sequelize";
// import { USER_ROLES } from "../utils/constants";
import sequelize from "../database";

export class UserRole extends Model<
  InferAttributes<UserRole>,
  InferCreationAttributes<UserRole>
> {
  declare id: CreationOptional<string>;
  declare userRole: CreationOptional<string>;
}
UserRole.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    userRole: {
      type: STRING,
      // validate: {
      //   isIn: {
      //     args: [Object.values(USER_ROLES)],
      //     msg: "userroles should be valid ",
      //   },
      // },
    },
  },
  {
    sequelize: sequelize,
    tableName: "roles",
    modelName: "roles",
    timestamps: false,
  }
);
