const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../connect/connection.js');
// database connect
require('../../connect/connection.js');


const Comments = sequelize.define('comments', {
    // Model attributes are defined here
    commentId: {
        type: DataTypes.BIGINT(20),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    renterId: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    roomId: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    star: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    // Other model options go here
    tableName: 'comments',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });


module.exports = Comments;

