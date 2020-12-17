const { Sequelize, Op} = require('sequelize');
const sequelize = require('../connect/connection.js');
const models = require('../models/models.js');
const Users = require('../models/models/users.js');
const roles = models.roles();
const typeRooms = models.typeRooms();
const typeUsers = models.typeUsers();
const typeTimes = models.typeTimes();
const users = models.users();
const admins = models.admins();
const owners = models.owners();
const renters = models.renters();
const comments = models.comments();
const rooms = models.rooms();

module.exports.authentication = (username_ = '', password_ = '') => {
    let filter = {};
    if(username_)
        filter.username = username_;
    return users.findOne({
        where: filter,
        attributes: { exclude: ['typeId', 'roleId'] },
        include: [
            {model: typeUsers, attributes: ['name']},
            {model: roles, attributes: ['permission']}
        ]
    }).then(data => JSON.parse(JSON.stringify(data)))
    .then(user => {
        if(!user)
            throw new Error('No such user found');
        if(password_ !== user.password)
            throw new Error('Password is incorrect');
        delete user.username;
        delete user.password;
        switch (user.typeUser.name) {
            case 'admin':
                return admins.findOne({
                    where: {
                        userId: user.userId
                    },
                    attributes: ['adminId']
                }).then(data => JSON.parse(JSON.stringify(data)).adminId)
                .then(adminId => {
                    user.adminId = adminId;
                    return user;
                });
            case 'owner':
                return owners.findOne({
                    where: {
                        userId: user.userId
                    },
                    attributes: ['ownerId']
                }).then(data => JSON.parse(JSON.stringify(data)).ownerId)
                .then(ownerId => {
                    user.ownerId = ownerId;
                    return user;
                });
            case 'renter':
                return renters.findOne({
                    where: {
                        userId: user.userId
                    },
                    attributes: ['renterId']
                }).then(data => JSON.parse(JSON.stringify(data)).renterId)
                .then(renterId => {
                    user.renterId = renterId;
                    return user;
                });
            default:
                return new Error('Không tồn tại loại người dùng');
        }
    });
}

module.exports.infoUser = async (userId_ = '') => {
    if(!userId_)
        throw new Error('Tài khoản không tồn tại');
    let user = await Users.findOne({
        where: {
            userId: userId_
        },
        attributes: { exclude: ['typeId', 'roleId', 'username', 'password'] },
        include: [
            {model: typeUsers, attributes: ['name']},
            {model: roles, attributes: ['permission']}
        ]
    }).then(data => JSON.parse(JSON.stringify(data)));
    switch (user.typeUser.name) {
        case 'admin':
            return admins.findOne({
                where: {
                    userId: userId_
                },
                attributes: { exclude: ['userId', 'adminId'] }
            }).then(data => JSON.parse(JSON.stringify(data)))
            .then(data => {
                data.typeUser = user.typeUser.name;
                data.role = user.role.permission;
                return data;
            });
        case 'owner':
            return owners.findOne({
                where: {
                    userId: userId_
                },
                attributes: { exclude: ['userId', 'ownerId'] }
            }).then(data => JSON.parse(JSON.stringify(data)))
            .then(data => {
                data.typeUser = user.typeUser.name;
                data.role = user.role.permission;
                return data;
            });
        case 'renter':
            return renters.findOne({
                where: {
                    userId: userId_
                },
                attributes: { exclude: ['userId', 'renterId'] }
            }).then(data => JSON.parse(JSON.stringify(data)))
            .then(data => {
                data.typeUser = user.typeUser.name;
                data.role = user.role.permission;
                return data;
            });
        default:
            return new Error('Không tồn tại loại người dùng');
    }
}