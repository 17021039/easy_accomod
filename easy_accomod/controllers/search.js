const { Sequelize, Op} = require('sequelize');
const sequelize = require('../connect/connection.js');
const models = require('../models/models.js');
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
const notices = models.notices();
const object = require('../models/object.js');

module.exports.roles = (roleId_ = '', permission_ = '') => {
    let filter = {};
    if(roleId_)
        filter.roleId = roleId_;
    if(permission_)
        filter.permission = { [Op.substring]: permission_};
    return roles.findAll({
        where: filter
    }).then(data => JSON.parse(JSON.stringify(data)));
}

module.exports.typeRooms = (typeId_ = '',  name_ = '') => {
    let filter = {};
    if(typeId_)
        filter.typeId = typeId_;
    if(name_)
        filter.name = { [Op.substring]: name_};
    return typeRooms.findAll({
        where: filter
    }).then(data => JSON.parse(JSON.stringify(data)));
}

module.exports.typeUsers = (typeId_ = '',  name_ = '') => {
    let filter = {};
    if(typeId_)
        filter.typeId = typeId_;
    if(name_)
        filter.name = { [Op.substring]: name_};
    return typeUsers.findAll({
        where: filter
    }).then(data => JSON.parse(JSON.stringify(data)));
}

module.exports.typeTimes = (typeId_ = '',  name_ = '') => {
    let filter = {};
    if(typeId_)
        filter.typeId = typeId_;
    if(name_)
        filter.name = { [Op.substring]: name_};
    return typeTimes.findAll({
        where: filter
    }).then(data => JSON.parse(JSON.stringify(data)));
}

module.exports.users = (userId_ = '', username_ = '', password_ = '', typeId_ = '', roleId_ = '') => {
    let filter = {};
    if(userId_)
        filter.userId = userId_;
    if(username_)
        filter.username = { [Op.substring]: username_};
    if(password_)
        filter.password = { [Op.substring]: password_};
    if(typeId_)
        filter.typeId = typeId_;
    if(roleId_)
        filter.roleId = roleId_;
    return users.findAll({
        where: filter,
        order: [[typeUsers,'name'],['username']],
        include: [
            {model: typeUsers, attributes: ['name']},
            {model: roles, attributes: ['permission']}
        ]
    }).then(data => JSON.parse(JSON.stringify(data)));
}

module.exports.admins = (adminId_ = '', userId_ = '', code_ = '', name_ = '') => {
    let filter = {};
    if(adminId_)
        filter.adminId = adminId_;
    if(userId_)
        filter.userId = userId_;
    if(code_)
        filter.code = { [Op.substring]: code_};
    if(name_)
        filter.name = { [Op.substring]: name_};
    return admins.findAll({
        where: filter
    }).then(data => JSON.parse(JSON.stringify(data)));
}

module.exports.owners = (ownerId_ = '', userId_ = '', code_ = '', name_ = '', residentId_ = '', phone_ = '', address_ = '', email_ = '', confirm_ = '') => {
    let filter = {};
    if(confirm_)
        confirm_ = object.convertBoolean(confirm_, 'confirm');

    if(ownerId_)
        filter.ownerId = ownerId_;
    if(userId_)
        filter.userId = userId_;
    if(code_)
        filter.code = {[Op.substring]: code_};
    if(name_)
        filter.name = {[Op.substring]: name_};
    if(residentId_)
        filter.residentId = {[Op.substring]: residentId_};
    if(phone_)
        filter.phone = {[Op.substring]: phone_};
    if(address_)
        filter.address = {[Op.substring]: address_};
    if(email_)
        filter.email = {[Op.substring]: email_};
    if(confirm_ === false || confirm_ === true)   
        filter.confirm = confirm_;
    return owners.findAll({
        where: filter
    }).then(data => JSON.parse(JSON.stringify(data)));
}

module.exports.renters = (renterId_ = '', userId_ = '', code_ = '', name_ = '', phone_ = '', email_ = '', roomId_ = '') => {
    let filter = {};
    if(renterId_)
        filter.renterId = renterId_;
    if(userId_)
        filter.userId = userId_;
    if(code_)
        filter.code = {[Op.substring]: code_};
    if(name_)
        filter.name = {[Op.substring]: name_};
    if(phone_)
        filter.phone = {[Op.substring]: phone_};
    if(email_)
        filter.email = {[Op.substring]: email_};
    if(roomId_)
        filter.roomId = { [Op.or]: [{[Op.substring]: (',' + roomId_ + ',')}, {[Op.substring]: ('[' + roomId_ + ',')}, {[Op.substring]: (',' + roomId_ + ']')}]};
    return renters.findAll({
        where: filter
    }).then(data => JSON.parse(JSON.stringify(data)));
}

module.exports.comments = (commentId_ = '', renterId_ = '', roomId_ = '', comment_ = '', star_ = '') => {
    let filter = {};
    if(commentId_)
        filter.commentId = commentId_;
    if(renterId_)
        filter.renterId = renterId_;
    if(roomId_)
        filter.roomId = roomId_;
    if(comment_)
        filter.comment = {[Op.substring]: comment_};
    if(star_)
        filter.star = star_;
    return comments.findAll({
        where: filter,
        include: [
            {model: rooms},
            {model: renters, attributes: ['name']}
        ]
    }).then(data => JSON.parse(JSON.stringify(data)));
}

module.exports.notices = (noticesId_ = '', ownerId_ = '', notification_ = '', readed_ = '') => {
    let filter = {};
    if(readed_)
        readed_ = object.convertBoolean(readed_,'readed');

    if(noticesId_)
        filter.noticesId = noticesId_;
    if(ownerId_)
        filter.ownerId = ownerId_;
    if(notification_)
        filter.notification = {[Op.substring]: notification_};
    if(readed_ === true || readed_ === false)
        filter.readed = readed_;
    return notices.findAll({
        where: filter,
        include: [
            {model: owners, attributes: ['ownerId','name']}
        ]
    }).then(data => JSON.parse(JSON.stringify(data)));
}

module.exports.rooms = (roomId_ = '', ownerId_ = '', code_ = '',
    address_ = '', nearAddress_ = '', typeId_ = '', amount_ = '', price_ = '', area_ = '', general_ = '',
    bathroom_ = '', heater_ = '', kitchen_ = '', airConditioner_ = '', balcony_ = '', electricityPrice_ = '', waterPrice_ = '', otherUtility_ = '',
    confirm_ = '',
    startDate_ = '', endDate_ = '', now_ = false) => {
    let filter = {};
    if(confirm_)
        confirm_ = object.convertBoolean(confirm_,'confirm');
    if(general_)
        general_ = object.convertBoolean(general_,'general');
    if(heater_)
        heater_ = object.convertBoolean(heater_,'heater');
    if(airConditioner_)
        airConditioner_ = object.convertBoolean(airConditioner_,'airConditioner');
    if(balcony_)
        balcony_ = object.convertBoolean(balcony_,'balcony');
    if(now_)
        now_ = object.convertBoolean(now_,'now');

    if(roomId_)
        filter.roomId = roomId_;
    if(ownerId_)
        filter.ownerId = ownerId_;
    if(code_)
        filter.code = {[Op.substring]: code_};
    if(address_)
        filter.address = {[Op.substring]: address_};
    if(nearAddress_)
        filter.nearAddress = {[Op.substring]: nearAddress_};
    if(typeId_)
        filter.typeId = typeId_;  
    if(amount_)
        filter.amount = amount_;  
    if(price_)
        filter.price = price_; 
    if(area_)
        filter.area = area_; 
    if(general_ === false || general_ === true)   
        filter.general = general_;
    if(bathroom_)   
        filter.bathroom = bathroom_;
    if(heater_ === false || heater_ === true)   
        filter.heater = heater_;
    if(kitchen_)   
        filter.kitchen = {[Op.substring]: kitchen_};
    if(airConditioner_ === false || airConditioner_ === true)   
        filter.airConditioner = airConditioner_;
    if(balcony_ === false || balcony_ === true)   
        filter.balcony = balcony_;
    if(electricityPrice_)   
        filter.electricityPrice = electricityPrice_;
    if(waterPrice_)   
        filter.waterPrice = waterPrice_;
    if(otherUtility_)   
        filter.otherUtility = {[Op.substring]: otherUtility_};
    if(confirm_ === false || confirm_ === true)   
        filter.confirm = confirm_;

    
    
    if(now_) {
        now_ = new Date(Date.now());
        if(startDate_) {
            if(new Date(startDate_) < now_)
                startDate_ = now_;
        }
        else
            startDate_ = now_;

        if(endDate_) {
            if(new Date(endDate_) > now_)
                endDate_ = now_;
        }
        else
            endDate_ = now_;
    }
        
    if(startDate_) {
        filter.expiredDate = {[Op.gte]: startDate_};
    }
    if(endDate_) {
        filter.postingTime = {[Op.lte]: endDate_};
    }


    return rooms.findAll({
        where: filter,
        order: [['postingTime', 'DESC'],['expiredDate', 'DESC']],
        include: [
            {model: typeRooms, attributes: ['name']},
            {model: typeTimes, attributes: ['name']},
            {model: owners, attributes: ['name']}
        ]
    }).then(data => JSON.parse(JSON.stringify(data)));
}
