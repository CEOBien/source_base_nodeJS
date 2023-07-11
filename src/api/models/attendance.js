"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User_Attendances extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_Attendances.belongsTo(models.User_Attendance_Statuses, {
        foreignKey: "CHECKIN_STATUS_ID",
        onDelete: "CASCADE",
      });

      User_Attendances.belongsTo(models.User_CheckIn_Types, {
        foreignKey: "CHECKIN_TYPE_ID",
        onDelete: "CASCADE",
      });
    }
  }
  User_Attendances.init(
    {
      USER_ID: DataTypes.INTEGER,
      CHECK_IN_TIME: DataTypes.DATE,
      CHECK_OUT_TIME: DataTypes.DATE,
      LOCATION_ID: DataTypes.INTEGER,
      // CHECKIN_STATUS_ID: DataTypes.INTEGER,
      // CHECKIN_TYPE_ID: DataTypes.INTEGER,
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
      modelName: "User_Attendances",
      createdAt: "CREATED_DATE",
      updatedAt: "MODIFIED_DATE",
    }
  );

  return User_Attendances;
};
