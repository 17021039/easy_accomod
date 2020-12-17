const express = require('express');
const controller = require("../controllers/controller.js");
const { comments } = require('../models/models.js');
let router = express.Router();

router.get('/viewLogin', controller.viewLogin);
router.get('/viewInfoUser',controller.viewInfoUser);
router.get('/info',controller.info);
router.get('/chat', controller.chat);


router.get('/logout', controller.logout);

router.get('/roles', controller.roles);
router.get('/typeUsers', controller.typeUsers);
router.get('/image/:fileName', controller.image);

router.all('/download' ,controller.download)

router.all('/login', controller.login);
router.all('/infoUser',controller.infoUser);
router.all('/typeTimes',controller.typeTimes);
router.all('/typeRooms',controller.typeRooms);
router.all('/users',controller.users);
router.all('/admins',controller.admins);
router.all('/owners', controller.owners);
router.all('/renters', controller.renters);
router.all('/rooms', controller.rooms);
router.all('/comments', controller.comments);


module.exports = router;