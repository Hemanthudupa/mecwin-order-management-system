import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../database";
import { User } from "../user/model";

export class Distributor extends Model<
  InferAttributes<Distributor>,
  InferCreationAttributes<Distributor>
> {
  declare id: CreationOptional<string>;
  declare userId: CreationOptional<ForeignKey<User>>;
  declare fullName: CreationOptional<string>;
  declare password: CreationOptional<string>;

  declare aadharNumber: CreationOptional<string>;

  declare email: CreationOptional<string>;

  declare phoneNumber: CreationOptional<string>;

  declare companyName: CreationOptional<string>;

  declare gstNumber: CreationOptional<string>;

  declare priorExperience: CreationOptional<string>;

  declare panNumber: CreationOptional<string>;

  declare shipping_Address: CreationOptional<string>;

  declare shipping_Address_city: CreationOptional<string>;

  declare shipping_Address_state: CreationOptional<string>;

  declare shipping_Address_pincode: CreationOptional<string>;

  declare billing_Address: CreationOptional<string>;
  declare billing_Address_city: CreationOptional<string>;

  declare billing_Address_state: CreationOptional<string>;

  declare billing_Address_pincode: CreationOptional<string>;

  declare additional_remarks: CreationOptional<string>;

  declare attachments: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
Distributor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
    },
    fullName: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    aadharNumber: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    companyName: {
      type: DataTypes.STRING,
    },
    gstNumber: {
      type: DataTypes.STRING,
    },
    priorExperience: {
      type: DataTypes.STRING,
    },
    panNumber: {
      type: DataTypes.STRING,
    },
    shipping_Address: {
      type: DataTypes.STRING,
    },
    shipping_Address_city: {
      type: DataTypes.STRING,
    },
    shipping_Address_state: {
      type: DataTypes.STRING,
    },
    shipping_Address_pincode: {
      type: DataTypes.STRING,
    },
    billing_Address: {
      type: DataTypes.STRING,
    },

    billing_Address_city: {
      type: DataTypes.STRING,
    },
    billing_Address_state: {
      type: DataTypes.STRING,
    },
    billing_Address_pincode: {
      type: DataTypes.STRING,
    },
    additional_remarks: {
      type: DataTypes.STRING,
    },
    attachments: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "distributor",
    tableName: "distributor",
    timestamps: true,
  }
);
