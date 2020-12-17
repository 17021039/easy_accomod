const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../connect/connection.js');

// database connect
require('../../connect/connection.js');


const Roles = sequelize.define('roles', {
    // Model attributes are defined here
    roleId: {
      type: DataTypes.BIGINT(20),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    permission: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    // Other model options go here
    tableName: 'roles',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });



module.exports = Roles;
