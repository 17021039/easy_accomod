const logic = require('./logic.js');
const get = require('./get.js');
const search = require('./search.js');
const set = require('./set.js');
const update = require('./update.js');
const object = require('../models/object.js');
const jwt = require('jsonwebtoken');
const path = require("path");
const shajs = require('sha.js')
const fs = require('fs');

const io = require('../app.js').io;

function writeFile(link_, method_, request_, response_) {
    let oldData = fs.readFileSync("../data.json",{encoding: "utf-8"});
    if(oldData)
        oldData = JSON.parse(oldData);
    else
        oldData = {}
    oldData["link: " + link_] = {
        method: method_,
        request: request_,
        response: response_ 
    };
    fs.writeFileSync("../data.json", JSON.stringify(oldData,null,2), "utf-8");
}

module.exports.viewLogin = (req,res,next) => {
    try {
        res.render('login');
    } catch (error) {
        next(error);
    } 
}

module.exports.viewInfoUser = (req,res,next) => {
    try {
        res.render('infoUser');
    } catch (error) {
        next(error);
    }
}

module.exports.info = (req,res,next) => {
    try {
        res.render('info');
    } catch (error) {
        next(error);
    }
}

module.exports.viewChat = (req,res,next) => {
    try {
        let options = {
            root: path.join('./'),
            dotfiles: 'deny',
            headers: {
              'x-timestamp': Date.now(),
              'x-sent': true
            }
          }
        
          let fileName = './views/index.html';
          res.sendFile(fileName, options, function (err) {
            if (err) {
              next(err)
            } else {
              console.log('Sent:', fileName)
            }
          })
    } catch (error) {
        next(error);
    }
}

// ===============================================================
// sent image

module.exports.image = (req,res,next) => {
    try {
        let options = {
            root: path.join('./image'),
            dotfiles: 'deny',
            headers: {
              'x-timestamp': Date.now(),
              'x-sent': true
            }
          }
        
          let fileName = req.params.fileName;
          res.sendFile(fileName, options, function (err) {
            if (err) {
              next(err)
            } else {
              console.log('Sent:', fileName)
            }
          })
    } catch (error) {
        next(error);
    }
}


module.exports.download = (req,res,next) => {
    try {
        console.log(req.files);
        console.log(req.body);
        res.send('true');
    } catch (error) {
        next(error);
    }
}




// ===============================================================
// chat


// server.listen(port, function(){
//     console.log('listening on port ' + port);
// });


module.exports.chat = async (req,res,next) => {
    try {
        let name;
        let msg = req.body.msg;
        if(req.account.typeUser.name === 'admin')
            name = 'admin';
        else
            name = await logic.infoUser(req.account.userId).then(user => user.name);

        console.log(req.account);

            if(msg)
                io.emit('new:message', {name: name, msg: msg});

            else
                io.emit('new:member', name);

        res.send(true);
    } catch (error) {
        next(error);
    }
}

module.exports.removeChat = async (req,res,next) => {
    try {
        res.clearCookie('chatIo');
        res.send(true);
    } catch (error) {
        next(error);
    }
}


// ===============================================================
// user


module.exports.login = async (req,res,next) => {
    try {
        let username_ = req.body.username;
        let password_ = req.body.password;
        if (username_ && password_) {
            // we get the user with the username and save the resolved promise returned
            let user = await logic.authentication(username_, password_);
            // sequelize.close();

            let payload = { user: user};
            let authenticationToken = jwt.sign(payload, process.env.SECRET_OR_PRIVATE_KEY, { expiresIn: '1h'});
            let io_ = {};
            io_[user.typeUser.name + 'Id'] = user[user.typeUser.name + 'Id'];
            io_ = shajs('sha256').update(JSON.stringify(io_)).digest('hex');
            let typeUser = shajs('sha256').update(JSON.stringify(user.typeUser.name)).digest('hex');
            // writeFile('/login','POST',req.body, payload);
            // console.log(req.headers.origin);
            let domain = req.headers.origin.split('/');
            domain = domain[domain.length -1].split(':')[0];
            switch (req.headers['sec-fetch-site']) {
                case 'same-origin':
                    res.cookie('AuthenticationToken', authenticationToken);
                    res.cookie('io', io_, {encode: String});
                    res.cookie('typeUser', typeUser, {encode: String});
                    break;
                case 'same-site':
                    res.cookie('AuthenticationToken', authenticationToken);
                    res.cookie('io', io_, {encode: String});
                    res.cookie('typeUser', typeUser, {encode: String});
                    break;
                case 'cross-site':
                    res.cookie('AuthenticationToken', authenticationToken, {domain:  domain, encode: String, secure: true, sameSite: 'none'});
                    res.cookie('io', io_, {domain:  domain, encode: String, secure: true, sameSite: 'none'});
                    res.cookie('typeUser', typeUser, {domain:  domain, encode: String, secure: true, sameSite: 'none'});
                    break;
                default:
                    break;
            }
            let temp = { secure: true, sameSite: 'none'};
            if(user.typeUser.name === 'owner') {
                let notices = await search.notices('', user.ownerId, '', false);
                io.emit('notReaded:notices', {io : shajs('sha256').update(JSON.stringify({ownerId: user.ownerId})).digest('hex'),msg: 'Bạn có ' + notices.length + ' thông báo chưa đọc'});
            }
            res.send({message: 'login success', payload});
            // console.log(res._headers);
        } else {
            throw new Error('Chưa có username, password');
        }
    } catch (error) {
        next(error);
    }
}

module.exports.logout = async (req,res,next) => {
    try {
        res.clearCookie('AuthenticationToken');
        res.clearCookie('io');
        res.clearCookie('typeUser');
        res.clearCookie('chatIo');
        res.send({status: true});
    } catch (error) {
        next(error);
    }
}

module.exports.infoUser = async (req,res,next) => {
    try {
        let user = await logic.infoUser(req.account.userId);
        // sequelize.close();
        res.send({user: user});
    } catch (error) {
        next(error);
    }
}

// ===============================================================
// role

module.exports.roles = async (req,res,next) => {
    try {
        let roleId_ = req.body.roleId;
        let permission_ = req.body.permission;
        if(req.account.typeUser.name !== 'admin')
            throw new Error('Bạn phải là admin mới được xem');
        let roles = await search.roles(roleId_, permission_);
        res.send({roles: roles});
    } catch (error) {
        next(error);
    }
}

// ===============================================================
// typeUser

module.exports.typeUsers = async (req,res,next) => {
    try {
        let typeId_ = req.body.typeId;
        let name_ = req.body.name;
        if(req.account.typeUser.name !== 'admin')
            throw new Error('Bạn phải là admin mới được xem');
        let typeUsers = await search.typeUsers(typeId_, name_);
        res.send({typeUsers: typeUsers});
    } catch (error) {
        next(error);
    }
}

// ===============================================================
// typeTime

module.exports.typeTimes = async (req,res,next) => {
    try {
        let typeId_ = req.body.typeId;
        let name_ = req.body.name;
        let status = false;
        let typeTimes = [];
        
        switch (req.method) {
            case 'GET':
                typeTimes = await search.typeTimes(typeId_, name_);
                res.send({typeTimes: typeTimes});
                break;
            case 'POST':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        throw new Error('Bạn không có quyền tạo đơn vị thời gian');
                        break;
                    case 'admin':
                        break;
                    case 'owner':
                        throw new Error('Bạn không có quyền tạo đơn vị thời gian');
                        break;
                    default:
                        break;
                }
                status = await set.typeTimes(name_);
                
                res.status(201).send({status: status});
                break;
            case 'PUT':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        throw new Error('Bạn không có quyền cập nhật đơn vị thời gian');
                        break;
                    case 'admin':
                        break;
                    case 'owner':
                        throw new Error('Bạn không có quyền cập nhật đơn vị thời gian');
                        break;
                    default:
                        break;
                }
                if(!typeId_)
                    throw new Error('Chưa có typeId');
                status = await update.typeTimes(typeId_, name_);
                res.status(201).send({status: status});
                break;
            default:
                throw new Error('Phương thức gửi không đúng');
        }
    } catch (error) {
        next(error);
    }
}

// ===============================================================
// typeRoom

module.exports.typeRooms = async (req,res,next) => {
    try {
        let typeId_ = req.body.typeId;
        let name_ = req.body.name;
        let status = false;

        switch (req.method) {
            case 'GET':
                let typeRooms = await search.typeRooms(typeId_, name_);
                res.send({typeRooms: typeRooms});
                break;
            case 'POST':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        throw new Error('Bạn không có quyền tạo đơn vị thời gian');
                        break;
                    case 'admin':
                        break;
                    case 'owner':
                        throw new Error('Bạn không có quyền tạo đơn vị thời gian');
                        break;
                    default:
                        break;
                }
                status = await set.typeRooms(name_);
                
                res.status(201).send({status: status});
                break;
            case 'PUT':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        throw new Error('Bạn không có quyền cập nhật đơn vị thời gian');
                        break;
                    case 'admin':
                        break;
                    case 'owner':
                        throw new Error('Bạn không có quyền cập nhật đơn vị thời gian');
                        break;
                    default:
                        break;
                }
                if(!typeId_)
                    throw new Error('Chưa có typeId');
                status = await update.typeRooms(typeId_, name_);
                res.status(201).send({status: status});
                break;
            default:
                throw new Error('Phương thức gửi không đúng');
        }
    } catch (error) {
        next(error);
    }
}

// ===============================================================
// users

module.exports.users = async (req,res,next) => {
    try {
        let userId_ = req.body.userId;
        let typeId_ = req.body.typeId;
        let roleId_ = req.body.roleId;
        let username_ = req.body.username;
        let password_ = req.body.password;
        let status = false;

        switch (req.method) {
            case 'GET':
                if(req.account.typeUser.name !== 'admin')
                    throw new Error('Bạn phải là admin mới được xem');
                let users = await search.users(userId_, username_, password_, typeId_, roleId_);
                res.send({users: users});
                break;
            case 'POST':
                throw new Error('Không thể tạo tài khoản trực tiếp');
                break;
            case 'PUT':
                status = await update.users(req.account.userId, password_);
                res.status(201).send({status: status});
                break;
            default:
                throw new Error('Phương thức gửi không đúng');
        }
    } catch (error) {
        next(error);
    }
}

// ===============================================================
// admin

module.exports.admins = async (req,res,next) => {
    try {
        let adminId_ = req.body.adminId;
        let userId_ = req.body.userId;
        let code_ = req.body.code;
        let name_ = req.body.name;
        let username_ = req.body.username;
        let password_ = req.body.password;
        let status = false;

        switch (req.method) {
            case 'GET':
                if(req.account.typeUser.name !== 'admin')
                    throw new Error('Bạn phải là admin mới được xem');
                let admins = await search.admins(adminId_, userId_, code_, name_);
                res.send({admins: admins});
                break;
            case 'POST':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        throw new Error('Bạn không có quyền tạo tài khoản admin');
                        break;
                    case 'admin':
                        break;
                    case 'owner':
                        throw new Error('Bạn không có quyền tạo tài khoản admin');
                        break;
                    default:
                        break;
                }
                status = await set.admins(code_, name_, username_, password_);
                
                res.status(201).send({status: status});
                break;
            case 'PUT':

                switch (req.account.typeUser.name) {
                    case 'renter':
                        throw new Error('Bạn không có quyền cập nhật tài khoản admin');
                        break;
                    case 'admin':
                        break;
                    case 'owner':
                        throw new Error('Bạn không có quyền cập nhật tài khoản admin');
                        break;
                    default:
                        break;
                }
                if(!adminId_)
                    throw new Error('Chưa có adminId');
                status = await update.admins(adminId_, req.account.userId, code_, name_);
                res.status(201).send({status: status});
                break;
            default:
                throw new Error('Phương thức gửi không đúng');
        }
    } catch (error) {
        next(error);
    }
}


// ===============================================================
// comment

module.exports.comments = async (req,res,next) => {
    try {
        let commentId_ = req.body.commentId;
        let renterId_ = req.body.renterId;
        let roomId_ = req.body.roomId;
        let comment_ = req.body.comment;
        let star_ = req.body.star;
        let status = false;
        switch (req.method) {
            case 'GET':
                let comments = await search.comments(commentId_, renterId_, roomId_, comment_, star_);
                res.send({comments: comments});
                break;
            case 'POST':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        renterId_ = req.account.renterId;
                        break;
                    case 'admin':
                        throw new Error('Bạn không có quyền bình luận');
                        break;
                    case 'owner':
                        throw new Error('Bạn không có quyền bình luận');
                        break;
                    default:
                        break;
                }

                status = await set.comments(renterId_, roomId_, comment_, star_);
                if(status) {
                    let ownerId = await get.room(roomId_).then(room => room.ownerId);
                    io.emit('new:notices',{io : shajs('sha256').update(JSON.stringify({ownerId: ownerId})).digest('hex'),msg: 'Bạn có thông báo mới'});
                }
                res.status(201).send({status: status});
                break;
            case 'PUT':               
                switch (req.account.typeUser.name) {
                    case 'renter':
                        renterId_ = req.account.renterId;
                        break;
                    case 'admin':
                        throw new Error('Bạn không có quyền thay đổi bình luận');
                        break;
                    case 'owner':
                        throw new Error('Bạn không có quyền thay đổi bình luận');
                        break;
                    default:
                        break;
                }
                if(!commentId_)
                    throw new Error('Chưa có commentId');
                status = await update.comments(commentId_, renterId_, comment_, star_);
                res.status(201).send({status: status});
                break;
            default:
                throw new Error('Phương thức gửi không đúng');
        }
    } catch (error) {
        next(error);
    }
}

// ===============================================================
// notice

module.exports.notices = async (req,res,next) => {
    try {
        let noticesId_ = req.body.noticesId;
        let ownerId_ = req.body.ownerId;
        let notification_ = req.body.notification;
        let readed_ = req.body.readed;
        let status = false;

        switch (req.method) {
            case 'GET':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        throw new Error('Bạn không có quyền xem thông báo');
                        break;
                    case 'admin':
                        break;
                    case 'owner':
                        ownerId_ = req.account.ownerId;
                        break;
                    default:
                        break;
                }
                let notices = await search.notices(noticesId_, ownerId_, notification_, readed_);
                res.send({notices: notices});
                break;
            case 'PUT':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        throw new Error('Bạn không có quyền thay đổi thông báo');
                        break;
                    case 'admin':
                        throw new Error('Bạn không có quyền thay đổi thông báo');
                        break;
                    case 'owner':
                        ownerId_ = req.account.ownerId;
                        break;
                    default:
                        break;
                }
                status = await update.notices(noticesId_, ownerId_, '', readed_);
                res.status(201).send({status: status});
                break;

            default:
                throw new Error('Phương thức gửi không đúng');
        }
    } catch (error) {
        next(error);
    }
}


// ===============================================================
// owner

module.exports.owners = async (req,res,next) => {
    try {
        let ownerId_ = req.body.ownerId;
        let code_ = req.body.code;
        let userId_ = req.body.userId;
        let name_ = req.body.name;
        let residentId_ = req.body.residentId;
        let phone_ = req.body.phone;
        let address_ = req.body.address;
        let email_ = req.body.email;
        let confirm_ = req.body.confirm;
        let username_ = req.body.username;
        let password_ = req.body.password;
        let status = false;
        console.log(req.body)

        switch (req.method) {
            case 'GET':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        throw new Error('Bạn không có quyền xem tài khoản chủ phòng trọ')
                        break;
                    case 'owner':
                        ownerId_ = req.account.ownerId;
                        userId_ = req.account.userId;
                        code_ = '';
                        name_ = '';
                        residentId_ = '';
                        phone_ = '';
                        address_ = '';
                        email_ = '';
                        confirm_ = '';
                        break;
                    case undefined:
                        throw new Error('Bạn không có quyền xem tài khoản chủ phòng trọ')
                        break;
                    default:
                        break;
                }
                let owners = await search.owners(ownerId_, userId_, code_, name_, residentId_, phone_, address_, email_, confirm_);
                res.send({owners: owners});
                break;
            case 'POST':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        throw new Error('Bạn không có quyền tạo tài khoản chủ phòng trọ');
                        break;
                    case 'admin':
                        confirm_ = true;
                        break;
                    case 'owner':
                        throw new Error('Bạn không có quyền tạo tài khoản chủ phòng trọ khác');
                        break;
                    case undefined:
                        confirm_ = false;
                        break;
                    default:
                        break;
                }
                status = await set.owners(code_, name_, residentId_, phone_, address_, email_, username_, password_, confirm_);
                if(status && confirm_) {
                    let owner = await search.owners('', '', code_);
                    io.emit('new:notices',{io : shajs('sha256').update(JSON.stringify({ownerId: owner.ownerId})).digest('hex'), msg: 'Bạn có thông báo mới'});
                }
                res.status(201).send({status: status});
                break;
            case 'PUT':
                let admin_ = false;
                switch (req.account.typeUser.name) {
                    case 'renter':
                        throw new Error('Bạn không có quyền cập nhật tài khoản chủ phòng trọ');
                        break;
                    case 'admin':
                        admin_ = true;
                        if(!ownerId_)
                            throw new Error('Chưa có ownerId');
                        break;
                    case 'owner':
                        ownerId_ = req.account.ownerId;
                        confirm_ = undefined;
                        break;
                    default:
                        break;
                }
                status = await update.owners(ownerId_, code_, name_, residentId_, phone_, address_, email_, confirm_, admin_);
                if(status === 1) {
                    io.emit('new:notices',{io : shajs('sha256').update(JSON.stringify({ownerId: ownerId_})).digest('hex'), msg: 'Bạn có thông báo mới'});
                }
                res.status(201).send({status: status});
                break;
            default:
                throw new Error('Phương thức gửi không đúng');
        }

    } catch (error) {
        next(error);
    }
}


// ===============================================================
// renter

module.exports.renters = async (req,res,next) => {
    try {
        let renterId_ = req.body.renterId;
        let userId_ = req.body.userId;
        let code_ = req.body.code;
        let name_ = req.body.name;
        let phone_ = req.body.phone;
        let email_ = req.body.email;
        let username_ = req.body.username;
        let password_ = req.body.password;
        let roomId_ = req.body.roomId;
        let follow_ = req.body.follow;
        let status = false;


        switch (req.method) {
            case 'GET':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        renterId_ = req.account.renterId;
                        userId_ = req.account.userId;
                        break;
                    case 'owner':
                        throw new Error('Bạn không có quyền xem tài khoản người thuê')
                        break;
                    case undefined:
                        throw new Error('Bạn không có quyền xem tài khoản người thuê')
                        break;
                    default:
                        break;
                }
                let renters = await search.renters(renterId_, userId_, code_, name_, phone_, email_, roomId_);
                res.send({renters: renters});
                break;
            case 'POST':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        throw new Error('Bạn không có quyền tạo tài khoản người khác')
                        break;
                    case 'admin':
                    
                        break;
                    case 'owner':
                        throw new Error('Bạn không có quyền tạo tài khoản người thuê')
                        break;
                    default:
                        break;
                }
                status = await set.renters(code_, name_, phone_, email_, username_, password_);
                res.status(201).send({status: status});
                break;
            case 'PUT':
                if(follow_) {
                    follow_ = object.convertBoolean(follow_,'follow');
                } else {
                    if(roomId_)
                        follow_ = true;
                }
                switch (req.account.typeUser.name) {
                    case 'renter':
                        renterId_ = req.account.renterId;
                        break;
                    case 'admin':
                        if(!renterId_)
                            throw new Error('Chưa có renterId');
                        roomId_ = undefined;
                        break;
                    case 'owner':
                        throw new Error('Bạn không có quyền cập nhật tài khoản người thuê')
                        break;
                    default:
                        break;
                }
                status = await update.renters(renterId_, code_, name_, phone_, email_, roomId_, follow_);
                if(status && follow_ && roomId_) {
                    let ownerId = await get.room(roomId_).then(room => room.ownerId);
                    io.emit('new:notices',{io : shajs('sha256').update(JSON.stringify({ownerId: ownerId})).digest('hex'),msg: 'Bạn có thông báo mới'});
                }
                res.status(201).send({status: status});
                break;
            default:
                throw new Error('Phương thức gửi không đúng');
        }
        
    } catch (error) {
        next(error);
    }
}



// ===============================================================
// room


module.exports.rooms = async (req,res,next) => {
    try {
        let roomId_ = req.body.roomId;
        let ownerId_ = req.body.ownerId;
        let code_ = req.body.code;
        let address_ = req.body.address;  
        let nearAddress_ = req.body.nearAddress; 
        let typeId_ = req.body.typeId;  
        let amount_ = req.body.amount;
        let price_ = req.body.price;
        let area_ = req.body.area; 
        let general_ = req.body.general; 
        let image_ = req.files;  
        let typeTimeId_ = req.body.typeTimeId; 
        let shownTime_ = req.body.shownTime;  
        let bathroom_ = req.body.bathroom; 
        let heater_ = req.body.heater;
        let kitchen_ = req.body.kitchen;
        let airConditioner_ = req.body.airConditioner; 
        let balcony_ = req.body.balcony; 
        let electricityPrice_ = req.body.electricityPrice;
        let waterPrice_ = req.body.waterPrice;
        let otherUtility_ = req.body.otherUtility;
        let confirm_ = req.body.confirm;
        let now_ = req.body.now;
        let startDate_ = req.body.startDate;
        let endDate_ = req.body.endDate;
        let maxFollow_ = req.body.maxFollow;
        let maxComment_ = req.body.maxComment;
        let maxStar_ = req.body.maxStar;
        let status = false;
        
        switch (req.method) {
            case 'GET':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        confirm_ = true;
                        now_ = true;
                        break;
                    case 'admin':
                        break;
                    case 'owner':
                        ownerId_ = req.account.ownerId;
                        break;
                    default:
                        break;
                }
                let rooms = [];
                if(req.account.typeUser.name === 'renter') {
                    confirm_ = true;
                    now_ = true;
                }
                if(maxFollow_)
                    maxFollow = object.convertBoolean(maxFollow_, 'maxFollow');
                if(maxComment_)
                    maxComment = object.convertBoolean(maxComment_, 'maxComment');
                if(maxStar_)
                    maxStar = object.convertBoolean(maxStar_, 'maxStar');

                if(maxFollow_ || maxComment_ || maxStar_)
                    rooms = await logic.maxRoom(maxFollow_, maxComment_, maxStar_);
                else  
                    rooms = await search.rooms(roomId_, ownerId_, code_,
                    address_, nearAddress_, typeId_, amount_, price_, area_, general_,
                    bathroom_ , heater_, kitchen_, airConditioner_, balcony_, electricityPrice_, waterPrice_, otherUtility_,
                    confirm_,
                    startDate_, endDate_, now_);
                res.send({rooms: rooms});
                    break;
            case 'POST':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        throw new Error('Bạn không có quyền tạo phòng');
                        break;
                    case 'admin':
                        confirm_ = true;
                        break;
                    case 'owner':
                        ownerId_ = req.account.ownerId;
                        confirm_ = false;
                        break;
                    default:
                        break;
                }

                if(image_.length !== 0) {
                    let imageUrl = [];
                    for(let image of image_) {
                        imageUrl.push('http://localhost:6660/image/' + image.filename);
                    }
                    image_ = JSON.stringify(imageUrl);
                } else {
                    image_ = undefined;
                }
                status = await set.rooms(ownerId_, code_,
                address_, nearAddress_, typeId_, amount_, price_, area_, general_, image_,
                typeTimeId_, shownTime_,
                bathroom_, heater_, kitchen_, airConditioner_, balcony_, electricityPrice_, waterPrice_, otherUtility_,
                confirm_);
                if(status && confirm_) 
                    io.emit('new:notices',{io : shajs('sha256').update(JSON.stringify({ownerId: ownerId_})).digest('hex'), msg: 'Bạn có thông báo mới'});
                res.status(201).send({status: status});
                break;
            case 'PUT':
                switch (req.account.typeUser.name) {
                    case 'renter':
                        throw new Error('Bạn không có quyền cập nhật phòng');
                        break;
                    case 'admin':
                        if(confirm_)
                            confirm_ = object.convertBoolean(confirm_, 'confirm');
                        break;
                    case 'owner':
                        ownerId_ = req.account.ownerId;
                        confirm_ = undefined;
                        break;
                    default:
                        break;
                }
                if(!roomId_)
                    throw new Error('Chưa có roomId');
                if(image_.length !== 0) {
                    let imageUrl = [];
                    for(let image of image_) {
                        imageUrl.push('http://localhost:6660/image/' + image.filename);
                    }
                    image_ = JSON.stringify(imageUrl);
                } else {
                    image_ = undefined;
                }
                
                status = await update.rooms(roomId_, ownerId_, code_,
                address_, nearAddress_, typeId_, amount_, price_, area_, general_, image_,
                typeTimeId_, shownTime_,
                bathroom_, heater_, kitchen_, airConditioner_, balcony_, electricityPrice_, waterPrice_, otherUtility_,
                confirm_);
                if(status && confirm_ !== undefined) {
                    let ownerId = await get.room(roomId_).then(room => room.ownerId);
                    io.emit('new:notices',{io : shajs('sha256').update(JSON.stringify({ownerId: ownerId})).digest('hex'),msg: 'Bạn có thông báo mới'});
                }
                res.status(201).send({status: status});
                break;
            default:
                throw new Error('Phương thức gửi không đúng');
        }
        
    } catch (error) {
        console.log(error);
        next(error);
    }
}

