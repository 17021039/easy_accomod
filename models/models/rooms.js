const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../connect/connection.js');
// database connect
require('../../connect/connection.js');


const Rooms = sequelize.define('rooms', {
    // Model attributes are defined here
    roomId: {
        type: DataTypes.BIGINT(20),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    ownerId: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nearAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    typeId: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    price: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        defaultValue: 0
    },
    area: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        defaultValue: 0
    },
    general: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postingTime: {
        type: DataTypes.DATEONLY
    },
    typeTimeId: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    shownTime: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expiredDate: {
        type: DataTypes.DATEONLY
    },
    bathroom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    heater: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    kitchen: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: false
    },
    airConditioner: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    balcony: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    electricityPrice: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        defaultValue: 0
    },
    waterPrice: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        defaultValue: 0
    },
    otherUtility: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    confirm: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    follows: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        defaultValue: 0
    },
    star: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        defaultValue: 0
    },
    comment: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        defaultValue: 0
    }
  }, {
    // Other model options go here
    tableName: 'rooms',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });



module.exports = Rooms;
