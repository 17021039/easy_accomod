const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.SERVER_USER, process.env.SERVER_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_unicode_520_ci'
    }
});

module.exports = sequelize;
global.sequelize = sequelize;