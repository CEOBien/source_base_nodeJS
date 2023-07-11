<<<<<<< HEAD
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CheckInStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CheckInStatus.init(
    {
      NAME: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CD: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: "CheckInStatus",
      createdAt: "CREATED_DATE",
      updatedAt: "MODIFIED_DATE",
    }
  );
  return CheckInStatus;
};
=======
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CheckInStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CheckInStatus.init(
    {
      NAME: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CD: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: "CheckInStatus",
      createdAt: "CREATED_DATE",
      updatedAt: "MODIFIED_DATE",
    }
  );
  return CheckInStatus;
};
>>>>>>> 940cfa322083c1553083e112954f2c7a261e60d3
