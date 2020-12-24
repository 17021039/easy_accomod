const { Sequelize} = require('sequelize');

const Admins = require('./models/admins.js');
const Comments = require('./models/comments.js');
const Owners = require('./models/owners.js');
const Renters = require('./models/renters.js');
const Roles = require('./models/roles.js');
const Rooms = require('./models/rooms.js');
const TypeRooms = require('./models/type_rooms');
const TypeTimes = require('./models/type_times');
const TypeUser = require('./models/type_users');
const Users = require('./models/users.js');
const Notices = require('./models/notices.js');


// hàm tạo các quan hệ của room và xuất room
module.exports.rooms = () => {
    Rooms.belongsTo(Owners, {
        foreignKey: { name: "ownerId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Rooms.belongsTo(TypeRooms, {
        foreignKey: { name: "typeId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Rooms.belongsTo(TypeTimes, {
        foreignKey: { name: "typeTimeId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Rooms.hasMany(Comments, {
        foreignKey: { name: "roomId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Rooms;
}

// hàm tạo các quan hệ của owner và xuất owner
module.exports.owners = () => {
    Owners.belongsTo(Users, {
        foreignKey: { name: "userId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Owners.hasMany(Rooms, {
        foreignKey: { name: "ownerId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Owners.hasMany(Notices, {
        foreignKey: { name: "ownerId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Owners;
}

// hàm tạo các quan hệ của admin và xuất admin
module.exports.admins = () => {
    Admins.belongsTo(Users, {
        foreignKey: { name: "userId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Admins;
}

// hàm tạo các quan hệ của renter và xuất renter
module.exports.renters = () => {
    Renters.belongsTo(Users, {
        foreignKey: { name: "userId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Renters.hasMany(Comments, {
        foreignKey: { name: "renterId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Renters;
}


// hàm tạo các quan hệ của comment và xuất comment
module.exports.comments = () => {
    Comments.belongsTo(Rooms, {
        foreignKey: { name: "roomId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Comments.belongsTo(Renters, {
        foreignKey: { name: "renterId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Comments;
}


// hàm tạo các quan hệ của user và xuất user
module.exports.users = () => {
    Users.belongsTo(Roles, {
        foreignKey: { name: "roleId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Users.belongsTo(TypeUser, {
        foreignKey: { name: "typeId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Users.hasOne(Owners, {
        foreignKey: { name: "userId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Users.hasOne(Renters, {
        foreignKey: { name: "userId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Users.hasOne(Admins, {
        foreignKey: { name: "userId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Users;
}

// hàm tạo các quan hệ của role và xuất role
module.exports.roles = () => {
    Roles.hasMany(Users, {
        foreignKey: { name: "roleId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Roles;
}

// hàm tạo các quan hệ của typeUser và xuất typeUser
module.exports.typeUsers = () => {
    TypeUser.hasMany(Users, {
        foreignKey: { name: "typeId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return TypeUser;
}

// hàm tạo các quan hệ của typeRoom và xuất typeRoom
module.exports.typeRooms = () => {
    TypeRooms.hasMany(Rooms, {
        foreignKey: { name: "typeId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return TypeRooms;
}

// hàm tạo các quan hệ của typeTime và xuất typeTime
module.exports.typeTimes = () => {
    TypeTimes.hasMany(Rooms, {
        foreignKey: { name: "typeId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return TypeTimes;
}

// hàm tạo các quan hệ của notice và xuất notice
module.exports.notices = () => {
    Notices.belongsTo(Owners, {
        foreignKey: { name: "ownerId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Notices;
}