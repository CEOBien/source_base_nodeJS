"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Countries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Countries.hasMany(models.Cities, {
        foreignKey: "COUNTRY_ID",
      })
    }
  }
  Countries.init(
    {
      NAME: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DESC: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      CD: DataTypes.STRING,
      NOTE: {
        type: DataTypes.STRING,
        allowNull: true,
      },
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
      modelName: "Countries",
      createdAt: "CREATED_DATE",
      updatedAt: "MODIFIED_DATE",
    }
  )
  return Countries
}
