<<<<<<< HEAD
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.CheckInStatus, {
        foreignKey: "CHECKIN_STATUS_ID",
        onDelete: "CASCADE",
      });

      Attendance.belongsTo(models.CheckInType, {
        foreignKey: "CHECKIN_TYPE_ID",
        onDelete: "CASCADE",
      });
    }
  }
  Attendance.init(
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
      modelName: "Attendance",
      createdAt: "CREATED_DATE",
      updatedAt: "MODIFIED_DATE",
    }
  );

  return Attendance;
};
=======
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.CheckInStatus, {
        foreignKey: "CHECKIN_STATUS_ID",
        onDelete: "CASCADE",
      });

      Attendance.belongsTo(models.CheckInType, {
        foreignKey: "CHECKIN_TYPE_ID",
        onDelete: "CASCADE",
      });
    }
  }
  Attendance.init(
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
      modelName: "Attendance",
      createdAt: "CREATED_DATE",
      updatedAt: "MODIFIED_DATE",
    }
  );

  return Attendance;
};
>>>>>>> 940cfa322083c1553083e112954f2c7a261e60d3
