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
const object = require('../models/object.js');
const fs = require('fs');

module.exports.roles = (roleId_ , permission_ = '') => {
    if(!roleId_)
        throw new Error('Chưa có roleId');
    let role = object.role('', permission_);
    return roles.update(role, {where: {roleId: roleId_}}).then(() => true);
}

module.exports.typeRooms = (typeId_, name_ = '') => {
    if(!typeId_)
        throw new Error('Chưa có typeId');
    let typeRoom = object.typeRoom('', name_);
    return typeRooms.update(typeRoom, {where: {typeId: typeId_}}).then(() => true);
}

module.exports.typeUsers = (typeId_, name_ = '') => {
    if(!typeId_)
        throw new Error('Chưa có typeId');
    let typeUser = object.typeUser('', name_);
    return typeUsers.update(typeUser, {where: {typeId: typeId_}}).then(() => true);
}

module.exports.typeTimes = (typeId_, name_ = '') => {
    if(!typeId_)
        throw new Error('Chưa có typeId');
    let typeTime = object.typeTime('', name_);
    return typeTimes.update(typeTime, {where: {typeId: typeId_}}).then(() => true);
}

module.exports.users = async (userId_, password_ = '') => {
    if(!userId_)
        throw new Error('Chưa có userId');
    if(!password_)
        throw new Error('Chưa nhập mật khẩu mới');

    let oldPassword = await users.findOne({
        where: {
            userId: userId_
        },
        attributes: ['password']
    }).then(data => JSON.parse(JSON.stringify(data)).password);

    if(oldPassword === password_)
        throw new Error('Mật khẩu trùng mật khẩu cũ');

    let user = object.user('', '', password_, '', '');
    return users.update(user, {where: {userId: userId_}}).then(() => true);
}

module.exports.admins = async (adminId_, userId_, code_ = '', name_ = '') => {
    if(!adminId_)
        throw new Error('Chưa có adminId');
    let userId = admins.findOne({
        where: {
            adminId: adminId_
        },
        attributes: ['userId']
    }).then(data => JSON.parse(JSON.stringify(data)).userId);
    
    if(userId !== userId_)
        throw new Error('Bạn không thể thay đổi thông tin của tài khoản khác')
    let admin = object.admin('', '', code_, name_);
    return admins.update(admin, {where: {adminId: adminId_}}).then(() => true);
}

module.exports.owners = async (ownerId_, code_ = '', name_ = '', residentId_ = '', phone_ = '', address_ = '', email_ = '', confirm_ = false, admin_ = true) => {
    if(!ownerId_)
        throw new Error('Chưa có ownerId');

    let oldOwner = await owners.findOne({
        where: {
            ownerId: ownerId_
        }
    }).then(data => JSON.parse(JSON.stringify(data)));

    if(Object.keys(oldOwner).length === 0)
        throw new Error('Không tồn tại chủ phòng trọ');
    if(!admin_) {
        if(oldOwner.confirm)
            throw new Error('Không thể thay đổi tài khoản đã xác nhận');
        else
            confirm_ = false;
    }

        
        
    let owner = object.owner('', '', code_, name_, residentId_, phone_, address_, email_, confirm_);
    return owners.update(owner, {where: {ownerId: ownerId_}}).then(() => true);
}

module.exports.renters = (renterId_, code_ = '', name_ = '', phone_ = '', email_ = '') => {
    if(!renterId_)
        throw new Error('Chưa có renterId');
    let renter = object.renter('', '', code_, name_, phone_, email_);
    return renters.update(renter, {where: {renterId: renterId_}}).then(() => true);
}

module.exports.comments = async (commentId_, renterId_, comment_ = '', star_ = '') => {
    if(!commentId_)
        throw new Error('Chưa có commentId');
    let comment = object.comment('', '', '', comment_, star_);
    let oldComment = await comments.findOne({
        where: {
            commentId: commentId_
        }
    }).then(data => JSON.parse(JSON.stringify(data)));
    
    if(renterId_ !== oldComment.renterId)
        throw new Error('Bạn không thể sửa bình luận của người khác');
    if(star_)
        star_ = parseInt(star_);
    if(star_ < 0 || star_ > 5)
        throw new Error('Số sao đánh giá không hợp lệ');
    if(object.containKeys('comment', Object.keys(comment), true) === false)
        throw new Error('Chưa đủ các trường bắt buộc');
    return sequelize.transaction(async (t) => {
        return comments.update(comment, {where: {commentId: commentId_}, transaction: t}).then(() => {
            return rooms.update({star: sequelize.literal('`star` + ' + (star_ - oldComment.star).toString())},
            {
                where: {
                    roomId: oldComment.roomId
                },
                transaction: t
            }).then(() => true);
        })
    })
}

module.exports.rooms = async (roomId_, ownerId_ = '', code_ = '',
    address_ = '', nearAddress_ = '', typeId_ = '', amount_ = '', price_ = '', area_ = '', general_ = '', image_ = '',
    typeTimeId_ = '', shownTime_ = '',
    bathroom_ = '', heater_ = '', kitchen_ = '', airConditioner_ = '', balcony_ = '', electricityPrice_ = '', waterPrice_ = '', otherUtility_ = '',
    confirm_ = undefined) => {

    if(!roomId_)
        throw new Error('Chưa có roomId');

    let oldRoom = await rooms.findOne({where: {roomId: roomId_}}).then(data => JSON.parse(JSON.stringify(data)));


    if(Object.keys(oldRoom).length === 0)
        throw new Error('Không tồn tại phòng để thay đổi')
    
    if(ownerId_ && ownerId_ !== oldRoom.ownerId)
        throw new Error('Bạn không có quyền thay đổi thông tin phòng trọ người khác');
    if(shownTime_ && (Date.now() <= new Date(oldRoom.expiredDate)))
        throw new Error('Chưa hết hạn để gia hạn');
    if(confirm_ === undefined && oldRoom.confirm)
        throw new Error('Bài viết đã duyệt');

    
    
    if(confirm_)
        confirm_ = object.convertBoolean(confirm_, 'confirm');

    if(image_) {
        let oldImage = JSON.parse(oldRoom.image);
        for(let image of oldImage) {
            image = image.split('/').pop();
            fs.unlink('./image/' + image, (err) => { console.log('Flie đã xóa')});
        }
    }

    let room = object.room('','', code_,
        address_, nearAddress_, typeId_, amount_, price_, area_, general_, image_,
        '', typeTimeId_, shownTime_, '',
        bathroom_, heater_, kitchen_, airConditioner_, balcony_, electricityPrice_, waterPrice_, otherUtility_,
        '', '', '', '');

    if(confirm_) {
        if(oldRoom.confirm)
            throw new Error('Không thể xác nhận lại bài đã xác nhận');
        let expiredDate_, postingTime_;
        postingTime_ = new Date(Date.now());
        expiredDate_ = new Date();
        if(shownTime_)
            shownTime_ = parseInt(shownTime_);
        else
            shownTime_ = oldRoom.shownTime;


        if(typeTimeId_) 
            typeTimeId_ = parseInt(typeTimeId_);
        else
            typeTimeId_ = oldRoom.typeTimeId;
        let typeTime = await typeTimes.findOne({where: {typeId: typeTimeId_}, attributes: ['name']})
                        .then(data => JSON.parse(JSON.stringify(data)).name);;
        
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
                expiredDate_.setFullYear(postingTime_.getFullYear() + shownTime_);
                break;
            default:
                break;
        }
        room.postingTime = postingTime_;
        room.expiredDate = expiredDate_;
        room.confirm = true;
    } else {
        if(confirm_ === false) {
            room.expiredDate = room.postingTime = null;
            room.confirm = false;
        }
    }
    
        
    let where = {
        roomId: roomId_,
    };

    return rooms.update(room, {
        where: where
    }).then(() => true);
}
