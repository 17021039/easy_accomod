const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../connect/connection.js');

// database connect
require('../../connect/connection.js');


const Notices = sequelize.define('notices', {
    // Model attributes are defined here
    noticesId: {
      type: DataTypes.BIGINT(20),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    ownerId: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    notification: {
        type: DataTypes.STRING,
        allowNull: false
    },
    readed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
  }, {
    // Other model options go here
    tableName: 'notices',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });



module.exports = Notices;
