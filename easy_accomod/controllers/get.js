const { Sequelize, Op} = require('sequelize');
const sequelize = require('../connect/connection.js');
const models = require('../models/models.js');
const role = models.roles();
const typeRoom = models.typeRooms();
const typeUser = models.typeUsers();
const typeTime = models.typeTimes();
const user = models.users();
const admin = models.admins();
const owner = models.owners();
const renter = models.renters();
const comment = models.comments();
const room = models.rooms();

module.exports.role = (id_) => {
    if(id_) {
        return role.findOne({
            where: {
                roleId: id_
            }
        }).then(data => JSON.parse(JSON.stringify(data))).catch(() => {});;
    }
    else
        return {};
}

module.exports.typeRoom = (id_) => {
    if(id_) {
        return typeRoom.findOne({
            where: {
                typeId: id_
            }
        }).then(data => JSON.parse(JSON.stringify(data))).catch(() => {});;
    }
    else
        return {};
}

module.exports.typeUser = (id_) => {
    if(id_) {
        return typeUser.findOne({
            where: {
                typeId: id_
            }
        }).then(data => JSON.parse(JSON.stringify(data))).catch(() => {});;
    }
    else
        return {};
}

module.exports.typeTime = (id_) => {
    if(id_) {
        return typeTime.findOne({
            where: {
                typeId: id_
            }
        }).then(data => JSON.parse(JSON.stringify(data))).catch(() => {});;
    }
    else
        return {};
}

module.exports.user = (id_) => {
    if(id_) {
        return user.findOne({
            where: {
                userId: id_
            },
            include: [
                {model: typeUser, attributes: ['name']},
                {model: role, attributes: ['permission']}
            ]
        }).then(data => JSON.parse(JSON.stringify(data))).catch(() => {});;
    }
    else
        return {};
}

module.exports.admin = (id_) => {
    if(id_) {
        return admin.findOne({
            where: {
                adminId: id_
            }
        }).then(data => JSON.parse(JSON.stringify(data))).catch(() => {});;
    }
    else
        return {};
}

module.exports.owner = (id_) => {
    if(id_) {
        return owner.findOne({
            where: {
                ownerId: id_
            }
        }).then(data => JSON.parse(JSON.stringify(data))).catch(() => {});;
    }
    else
        return {};
}

module.exports.renter = (id_) => {
    if(id_) {
        return renter.findOne({
            where: {
                renterId: id_
            }
        }).then(data => JSON.parse(JSON.stringify(data))).catch(() => {});;
    }
    else
        return {};
}

module.exports.comment = (id_) => {
    if(id_) {
        return comment.findOne({
            where: {
                commentId: id_
            }
        }).then(data => JSON.parse(JSON.stringify(data))).catch(() => {});;
    }
    else
        return {};
}

module.exports.room = (id_) => {
    if(id_) {
        return room.findOne({
            where: {
                roomId: id_
            }
        }).then(data => JSON.parse(JSON.stringify(data))).catch(() => {});;
    }
    else
        return {};
}

