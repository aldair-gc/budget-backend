import { Model, DataTypes } from "sequelize";

export default class Transaction extends Model {
  static init(sequelize) {
    super.init(
      {
        type: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        description: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        value: {
          type: DataTypes.FLOAT,
          defaultValue: 0.0,
        },
        expiration_day: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        year: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        month: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        repeat: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id" });
  }
}
