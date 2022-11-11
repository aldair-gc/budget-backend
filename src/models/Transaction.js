import { Model, DataTypes } from 'sequelize';

export default class Transaction extends Model {
  static init(sequelize) {
    super.init({
      type: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      description: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      value: {
        type: DataTypes.FLOAT,
        defaultValue: '',
      },
      expiration_day: {
        type: DataTypes.INTEGER,
        defaultValue: '',
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      year: {
        type: DataTypes.INTEGER,
        defaultValue: '',
      },
      month: {
        type: DataTypes.INTEGER,
        defaultValue: '',
      },
      repeat: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
    }, {
      sequelize,
    });

    return this;
  }
}
