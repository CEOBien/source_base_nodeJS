"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("User_Attendances", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      CHECK_IN_TIME: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      CHECK_OUT_TIME: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      LOCATION_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // CHECKIN_STATUS_ID: {
      //   type: Sequelize.INTEGER,
      //   defaultValue: 1,
      //   allowNull: false,
      // },
      // CHECKIN_TYPE_ID: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      // },
      CD: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CREATED_DATE: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      CREATED_BY: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      MODIFIED_DATE: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      MODIFIED_BY: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      IS_DELETED: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("User_Attendances");
  },
};
