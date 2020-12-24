const { Sequelize, Op, DATE} = require('sequelize');
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

module.exports.roles = (permission_ = '') => {
    let role = object.role('', permission_);
    if(object.containKeys('role', Object.keys(role), true) === false)
        throw new Error('Chưa đủ các trường bắt buộc');
    return roles.create(role).then(() => true);
}

module.exports.typeRooms = (name_ = '') => {
    let typeRoom = object.typeRoom('', name_);
    if(object.containKeys('typeRoom', Object.keys(typeRoom), true) === false)
        throw new Error('Chưa đủ các trường bắt buộc');
    return typeRooms.create(typeRoom).then(() => true);
}

module.exports.typeUsers = (name_ = '') => {
    let typeUser = object.typeUser('', name_);
    if(object.containKeys('typeUser', Object.keys(typeUser), true) === false)
        throw new Error('Chưa đủ các trường bắt buộc');
    return typeUsers.create(typeUser).then(() => true);
}

module.exports.typeTimes = (name_ = '') => {
    let typeTime = object.typeTime('', name_);
    if(object.containKeys('typeTime', Object.keys(typeTime), true) === false)
        throw new Error('Chưa đủ các trường bắt buộc');
    return typeTimes.create(typeTime).then(() => true);
}

module.exports.admins = async (code_ = '', name_ = '', username_ = '', password_ = '') => {

    return sequelize.transaction(async (t) => {
        return typeUsers.findOne({where: {name: 'admin'}, attributes: ['typeId'], transaction: t})
        .then(async (typeUser) => {
            typeUser = JSON.parse(JSON.stringify(typeUser));
            let roleId_ = await roles.findOne({where: {permission: 'admin'}, attributes: ['roleId']}).then(data => data.roleId);
            let user = object.user('', username_, password_ , typeUser.typeId, roleId_);
            if(object.containKeys('user', Object.keys(user), true) === false)
                throw new Error('Chưa đủ các trường bắt buộc');
            return users.create(user, {transaction: t}).then(user => {
                let admin = object.admin('', user.userId, code_, name_);
                if(object.containKeys('admin', Object.keys(admin),true) === false) 
                    throw new Error('Chưa đủ các trường bắt buộc');
                return admins.create(admin, {transaction: t}).then(() => true);
            });
        });
    });
}

module.exports.owners = (code_ = '', name_ = '', residentId_ = '', phone_ = '', address_ = '', email_ = '', username_ = '', password_ = '', confirm_ = false) => {
    return sequelize.transaction(async (t) => {
        return typeUsers.findOne({where: {name: 'owner'}, attributes: ['typeId'], transaction: t})
        .then(async (typeUser) => {
            typeUser = JSON.parse(JSON.stringify(typeUser));
            let roleId_ = await roles.findOne({where: {permission: 'owner'}, attributes: ['roleId']}).then(data => data.roleId);
            let user = object.user('', username_, password_ , typeUser.typeId, roleId_);
            if(object.containKeys('user', Object.keys(user), true) === false)
                throw new Error('Chưa đủ các trường bắt buộc');
            return users.create(user, {transaction: t}).then(user => {
                let owner = object.owner('', user.userId, code_, name_, residentId_, phone_, address_, email_, confirm_);
                if(object.containKeys('owner', Object.keys(owner),true) === false) 
                    throw new Error('Chưa đủ các trường bắt buộc');
                return owners.create(owner, {transaction: t}).then(owner => {
                    if(confirm_) {
                        let notice = object.notices('', owner.ownerId, 'Tài khoản của bạn đã được duyệt', false);
                        return notices.create(notice, {transaction: t}).then(() => true);
                    }
                    else
                        return true;
                });
            });
        });
    });
}

module.exports.renters = (code_ = '', name_ = '', phone_ = '', email_ = '', username_ = '', password_ = '') => {
    return sequelize.transaction(async (t) => {
        return typeUsers.findOne({where: {name: 'renter'}, attributes: ['typeId'], transaction: t})
        .then(async (typeUser) => {
            typeUser = JSON.parse(JSON.stringify(typeUser));
            let roleId_ = await roles.findOne({where: {permission: 'renter'}, attributes: ['roleId']}).then(data => data.roleId);
            let user = object.user('', username_, password_ , typeUser.typeId, roleId_, JSON.stringify([]));
            if(object.containKeys('user', Object.keys(user), true) === false)
                throw new Error('Chưa đủ các trường bắt buộc');
            return users.create(user, {transaction: t}).then(user => {
                let renter = object.renter('', user.userId, code_, name_, phone_, email_);
                if(object.containKeys('renter', Object.keys(renter),true) === false) 
                    throw new Error('Chưa đủ các trường bắt buộc');
                return renters.create(renter, {transaction: t}).then(() => true);
            });
        });
    });
}

module.exports.comments = (renterId_ = '', roomId_ = '', comment_ = '', star_ = '') => {
    let comment = object.comment('', renterId_, roomId_, comment_, star_);
    if(star_)
        star_ = parseInt(star_);
    if(object.containKeys('comment', Object.keys(comment), true) === false)
        throw new Error('Chưa đủ các trường bắt buộc');

    if(star_ < 0 || star_ > 5)
        throw new Error('Số sao đánh giá không hợp lệ');

    return sequelize.transaction(async (t) => {
        return comments.create(comment, {transaction: t}).then(() => {
            return rooms.update({comment: sequelize.literal('`comment` + 1'), star: sequelize.literal('`star` + ' + star_.toString())},
            {
                where: {
                    roomId: roomId_
                },
                transaction: t
            }).then(async () => {
                let room = await rooms.findOne({where: {roomId: roomId_}}).then(data => JSON.parse(JSON.stringify(data)));
                let renter = await renters.findOne({where: {renterId: renterId_}}).then(data => JSON.parse(JSON.stringify(data)));
                let notice = object.notices('', room.ownerId, 'Phòng ' + room.code + ' đã được bình luận bởi ' + renter.name + ' (' + renter.code + ')', false);
                return notices.create(notice, {transaction: t}).then(() => true);
            });
        })
    })
}

module.exports.notices = (noticesId_ = '', ownerId_ = '', notification_ = '') => {
    let notices_ = object.notices(noticesId_, ownerId_, notification_);
    if(object.containKeys('notices', Object.keys(notices), true) === false)
        throw new Error('Chưa đủ các trường bắt buộc');

    return notices.create(notices_).then(() => true);
}

module.exports.rooms = async (ownerId_ = '', code_ = '',
    address_ = '', nearAddress_ = '', typeId_ = '', amount_ = '', price_ = '', area_ = '', general_ = '', image_ = '',
    typeTimeId_ = '', shownTime_ = '',
    bathroom_ = '', heater_ = '', kitchen_ = '', airConditioner_ = '', balcony_ = '', electricityPrice_ = '', waterPrice_ = '', otherUtility_ = '',
    confirm_ = false) => {

    let room = object.room('', ownerId_, code_,
        address_, nearAddress_, typeId_, amount_, price_, area_, general_, image_,
        '', typeTimeId_, shownTime_, '',
        bathroom_, heater_, kitchen_, airConditioner_, balcony_, electricityPrice_, waterPrice_, otherUtility_,
        confirm_, 0, 0, 0); 
    
    if(object.containKeys('room', Object.keys(room), true) === false)
        throw new Error('Chưa đủ các trường bắt buộc');

    
    if(confirm_) {
        let expiredDate_, postingTime_;
        let typeTime = await typeTimes.findOne({where: {typeId: typeTimeId_}, attributes: ['name']})
        .then(data => JSON.parse(JSON.stringify(data)).name);
        postingTime_ = new Date(Date.now());
        expiredDate_ = new Date();
        shownTime_ = parseInt(shownTime_);
        switch (typeTime) {
            case 'tuần':
                expiredDate_.setDate(postingTime_.getDate() + shownTime_ * 7);
                break;
            case 'tháng':
                expiredDate_.setMonth(postingTime_.getMonth() + shownTime_);
                break;
            case 'quý':
                expiredDate_.setMonth(postingTime_.getMonth() + shownTime_ * 3);
                break;
            case 'năm':
                expiredDate_.setYear(postingTime_.getYear() + shownTime_);
                break;
            default:
                break;
        }

        room.postingTime = postingTime_;
        room.expiredDate = expiredDate_;
    }

    return sequelize.transaction(async (t) => {
        return rooms.create(room, {transaction: t}).then(room => {
            if(confirm_) {
                let notice = object.notices('', room.ownerId, 'Phòng ' + room.code + ' của bạn đã được duyệt', false);
                return notices.create(notice, {transaction: t}).then(() => true);
            }
            else
                return true;
        });
    })
    
}
