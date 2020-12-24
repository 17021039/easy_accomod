const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../connect/connection.js');
// database connect
require('../../connect/connection.js');


const Admins = sequelize.define('admins', {
    // Model attributes are defined here
    adminId: {
        type: DataTypes.BIGINT(20),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    // Other model options go here
    tableName: 'admins',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });



module.exports = Admins;
