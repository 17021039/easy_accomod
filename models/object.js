function convertBoolean(value, name) {
    try {
        value = JSON.parse(value);
        if(typeof(value) !== 'boolean')
            throw new Error();
        return value;
    } catch (error) {
            throw new Error(name + ' phải dạng BOOLEAN');
    }
}

module.exports.convertBoolean = convertBoolean;

// xuất ra object role 
module.exports.role = (roleId_, permission_) => {
    let role = {}
    if(roleId_)
        role.roleId = roleId_;
    if(permission_)
        role.permission = permission_;
    return role;
}

// xuất ra object type_room
module.exports.typeRoom = (typeId_, name_) => {
    let typeRoom = {}
    if(typeId_)
        typeRoom.typeId = typeId_;
    if(name_)
        typeRoom.name = name_;
    return typeRoom;
}

// xuất ra object type_time
module.exports.typeTime = (typeId_, name_) => {
    let typeTime = {}
    if(typeId_)
        typeTime.typeId = typeId_;
    if(name_)
        typeTime.name = name_;
    return typeTime;
}

// xuất ra object type_user
module.exports.typeUser = (typeId_, name_) => {
    let typeUser = {}
    if(typeId_)
        typeUser.typeId = typeId_;
    if(name_)
        typeUser.name = name_;
    return typeUser;
}

// xuất ra object user 
module.exports.user = (userId_, username_, password_, typeId_, roleId_) => {
    let user = {}
    if(userId_)
        user.userId = userId_;
    if(username_)
        user.username = username_;
    if(password_)
        user.password = password_;
    if(typeId_)   
        user.typeId = typeId_;
    if(roleId_)
        user.roleId = roleId_;
    return user;
}

// xuất ra object admin 
module.exports.admin = (adminId_, userId_, code_, name_) => {
    let admin = {}
    if(adminId_)
        admin.adminId = adminId_;
    if(userId_)
        admin.userId = userId_;
    if(code_)
        admin.code = code_;
    if(name_)   
        admin.name = name_;
    return admin;
}

// xuất ra object owner 
module.exports.owner = (ownerId_, userId_, code_, name_, residentId_, phone_, address_, email_, confirm_) => {
    let owner = {};
    if(confirm_)
        confirm_ = convertBoolean(confirm_,'confirm');

    if(ownerId_)
        owner.ownerId = ownerId_;
    if(userId_)
        owner.userId = userId_;
    if(code_)
        owner.code = code_;
    if(name_)   
        owner.name = name_;
    if(residentId_)   
        owner.residentId = residentId_;
    if(phone_)   
        owner.phone = phone_;
    if(address_)   
        owner.address = address_;
    if(email_)   
        owner.email = email_;
    if(confirm_ === false || confirm_ === true)   
        owner.confirm = confirm_;
    return owner;
}

// xuất ra object renter 
module.exports.renter = (renterId_, userId_, code_, name_, phone_, email_) => {
    let renter = {}
    if(renterId_)
        renter.renterId = renterId_;
    if(userId_)
        renter.userId = userId_;
    if(code_)
        renter.code = code_;
    if(name_)   
        renter.name = name_;
    if(phone_)   
        renter.phone = phone_;
    if(email_)   
        renter.email = email_;
    return renter;
}

// xuất ra object comment
module.exports.comment = (commentId_, renterId_, roomId_, comment_, star_) => {
    let comment = {};
    if(commentId_)
        comment.commentId = commentId_;
    if(renterId_)
        comment.renterId = renterId_;
    if(roomId_)
        comment.roomId = roomId_;
    if(comment_)   
        comment.comment = comment_;
    if(star_)   
        comment.star = star_;
    return comment;
}

// xuất ra object room
module.exports.room = (roomId_, ownerId_, code_,
     address_, nearAddress_, typeId_, amount_, price_, area_, general_, image_,
     postingTime_, typeTimeId_, shownTime_, expiredDate_,
     bathroom_, heater_, kitchen_, airConditioner_, balcony_, electricityPrice_, waterPrice_, otherUtility_,
     confirm_, follows_, star_, comment_) => {
    let room = {};

    if(confirm_)
        confirm_ = convertBoolean(confirm_,'confirm');
    if(general_)
        general_ = convertBoolean(general_,'general');
    if(heater_)
        heater_ = convertBoolean(heater_,'heater');
    if(airConditioner_)
        airConditioner_ = convertBoolean(airConditioner_,'airConditioner');
    if(balcony_)
        balcony_ = convertBoolean(balcony_,'balcony');

    if(roomId_)
        room.roomId = roomId_;
    if(ownerId_)
        room.ownerId = ownerId_;
    if(code_)
        room.code = code_;
    if(address_)   
        room.address = address_;
    if(nearAddress_)   
        room.nearAddress = nearAddress_;
    if(typeId_)   
        room.typeId = typeId_;
    if(amount_)   
        room.amount = amount_;
    if(price_)   
        room.price = price_;
    if(area_)   
        room.area = area_;
    if(general_ === false || general_ === true)   
        room.general = general_;
    if(image_)   
        room.image = image_;
    if(postingTime_)   
        room.postingTime = new Date(postingTime_);
    if(typeTimeId_)   
        room.typeTimeId = typeTimeId_;
    if(shownTime_)   
        room.shownTime = shownTime_;
    if(expiredDate_)   
        room.expiredDate = new Date(expiredDate_);
    if(bathroom_)   
        room.bathroom = bathroom_;
    if(heater_ === false || heater_ === true)   
        room.heater = heater_;
    if(kitchen_)   
        room.kitchen = kitchen_;
    if(airConditioner_ === false || airConditioner_ === true)   
        room.airConditioner = airConditioner_;
    if(balcony_ === false || balcony_ === true)   
        room.balcony = balcony_;
    if(electricityPrice_)   
        room.electricityPrice = electricityPrice_;
    if(waterPrice_)   
        room.waterPrice = waterPrice_;
    if(otherUtility_)   
        room.otherUtility = otherUtility_;
    if(confirm_ === false || confirm_ === true)   
        room.confirm = confirm_;
    if(follows_)   
        room.follows = follows_;
    if(star_)   
        room.star = star_;
    if(comment_)   
        room.comment = comment_;
    return room;
}

module.exports.containKeys = (nameObj, listKeys = [], required = false, get = false) => {
    let keys = {
        role: ['roleId', 'permission'],
        typeRoom: ['typeId', 'name'],
        typeUser: ['typeId', 'name'],
        typeTime: ['typeId', 'name'],
        user: ['userId','username', 'password', 'typeId', 'roleId'],
        admin: ['adminId', 'userId', 'code', 'name'],
        owner: ['ownerId', 'userId', 'code', 'name', 'residentId', 'phone', 'address', 'email', 'confirm'],
        renter: ['renterId', 'userId', 'code', 'name', 'phone', 'email'],
        comment: ['commentId', 'renterId', 'roomId', 'comment', 'star'],
        room: ['roomId', 'ownerId', 'code',
            'address', 'nearAddress', 'typeId', 'amount', 'price', 'area', 'general', 'image',
            'postingTime', 'typeTimeId', 'shownTime', 'expiredDate',
            'bathroom', 'heater', 'kitchen', 'airConditioner', 'balcony', 'electricityPrice', 'waterPrice', 'otherUtility',
            'confirm', 'follows', 'star', 'comment']
    }

    let requiredKeys = {
        role: ['permission'],
        typeRoom: ['name'],
        typeUser: ['name'],
        typeTime: ['name'],
        user: ['username', 'password', 'typeId', 'roleId'],
        admin: ['userId', 'code', 'name'],
        owner: ['userId', 'code', 'name', 'residentId', 'phone', 'address', 'email', 'confirm'],
        renter: ['userId', 'code', 'name', 'phone', 'email'],
        comment: ['renterId', 'roomId', 'comment', 'star'],
        room: ['ownerId', 'code',
            'address', 'typeId', 'amount', 'price', 'area', 'general', 'image',
            'postingTime', 'typeTimeId', 'shownTime',
            'bathroom', 'heater', 'kitchen', 'airConditioner', 'balcony', 'electricityPrice', 'waterPrice']
    }

    let getKeys = {
        
    }

    if(get) {
        let list = getKeys[nameObj];
        for(let element of listKeys) {
            if(list.indexOf(element) === -1)
                return false;
        }
        return true;
    } else {
        if(!required) {
            let list = keys[nameObj];
            for(let element of listKeys) {
                if(list.indexOf(element) === -1)
                    return false;
            }
            return true;
        }  
        else {
            let list = keys[nameObj];
            for(let element of listKeys) {
                if(list.indexOf(element) === -1)
                    return false;
            }
            list = requiredKeys[nameObj];
            for(let element of list) {
                if(listKeys.indexOf(element) === -1)
                    return false;
            }
    
            return true;
        }
    }

    
}