import {
  CreationOptional,
  DATE,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  STRING,
  UUID,
  UUIDV4,
} from "sequelize";
import { Product } from "../products/model";
import sequelize from "../database";

export class ScannedProducts extends Model<
  InferAttributes<ScannedProducts>,
  InferCreationAttributes<ScannedProducts>
> {
  declare id: CreationOptional<string>;
  declare productId: ForeignKey<Product>;

  declare productName: CreationOptional<string>;

  declare headSize: CreationOptional<string>;

  declare motorHp: CreationOptional<string>;
  declare current: CreationOptional<string>;

  declare stores_unit_unique_id: CreationOptional<string>;

  declare winding_unit_unique_id: CreationOptional<string>;

  declare qc_unit_unique_id: CreationOptional<string>;

  declare assembly_unit_unique_id: CreationOptional<string>;

  declare testing_unit_unique_id: CreationOptional<string>;

  declare packing_unit_unique_id: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ScannedProducts.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    assembly_unit_unique_id: {
      type: STRING,
    },
    packing_unit_unique_id: {
      type: STRING,
    },
    qc_unit_unique_id: {
      type: STRING,
    },
    stores_unit_unique_id: {
      type: STRING,
    },
    testing_unit_unique_id: {
      type: STRING,
    },
    winding_unit_unique_id: {
      type: STRING,
    },
    productName: {
      type: STRING,
    },
    productId: {
      type: UUID,
      references: {
        model: Product,
        key: "id",
      },
    },
    headSize: {
      type: STRING,
    },
    current: {
      type: STRING,
    },
    motorHp: {
      type: STRING,
    },
    createdAt: { type: DATE },
    updatedAt: { type: DATE },
  },
  {
    sequelize,
    tableName: "scanned_products",
    modelName: "scanned_products",
    timestamps: true,
  }
);
