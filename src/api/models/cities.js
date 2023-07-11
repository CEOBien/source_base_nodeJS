"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Cities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cities.belongsTo(models.Countries, {
        foreignKey: "COUNTRY_ID",
      })
    }
  }
  Cities.init(
    {
      NAME: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DESC: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      NOTE: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      CD: DataTypes.STRING,
      CREATED_DATE: DataTypes.DATE,
      CREATED_BY: DataTypes.INTEGER,
      MODIFIED_DATE: DataTypes.DATE,
      MODIFIED_BY: DataTypes.INTEGER,
      IS_DELETED: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Cities",
      createdAt: "CREATED_DATE",
      updatedAt: "MODIFIED_DATE",
    }
  )
  return Cities
}
