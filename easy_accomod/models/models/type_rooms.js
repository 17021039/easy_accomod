const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../connect/connection.js');

// database connect
require('../../connect/connection.js');


const TypeRooms = sequelize.define('typeRooms', {
    // Model attributes are defined here
    typeId: {
      type: DataTypes.BIGINT(20),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    // Other model options go here
    tableName: 'type_rooms',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });



module.exports = TypeRooms;
