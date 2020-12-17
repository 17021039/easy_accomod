const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const multer = require('multer');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
let methodOverride = require('method-override')


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './image')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
    }
})

let upload = multer({storage: storage});




app.use(cookieParser());

const path = require("path");
require('dotenv').config();
require('./connect/connection.js');
// authentication
const jwt = require('jsonwebtoken');


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// pug
app.set('view engine', 'pug');
app.set('views','./views');

// router
const router = require('./router/router.js');
const { route } = require('./router/router.js');
const port = 6660;

// Set static folder
// app.use(express.static('public'));

app.use(upload.any()); 
app.use('/',express.static(path.join(__dirname)));

function logErrors (err, req, res, next) {
    console.error(err.stack)
    next(err)
}

function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' })
    } else {
        next(err)
    }
}

function errorHandler (err, req, res, next) {
    res.status(500)
    res.render('error', { error: err })
}

app.use(methodOverride())
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

function authenticateToken(req,res,next) {
    try {
        if(req.query)
            req.body = Object.assign(req.body, req.query);
        
        // if(req.url === '/download')
        //     next();
        let authenticationToken = req.cookies ? req.cookies.AuthenticationToken : '';
        if(!authenticationToken) {
            let next_ = false;
            if(req.url === '/login')
                next_ = true;
            let notGetUrl = ['/renters', '/owners', '/admins', '/users', '/typeUsers', '/roles'];
            notGetUrl = notGetUrl.findIndex(url => url === req.url);
            if(req.method === 'GET' && notGetUrl === -1)
                next_ = true;
            if((req.url === '/owners' || req.url === '/renters') && req.method === 'POST')
                next_ = true;
            if(req.url === '/infoUser')
                throw new Error('Chưa đăng nhập')
            if(next_) {
                req.account = {
                    typeUser: {},
                    role: {}
                }
                next();
            } else
                throw new Error('Chưa đăng nhập');
        }
        else
            jwt.verify(authenticationToken, process.env.SECRET_OR_PRIVATE_KEY, (err, user) => {
                if(err) {
                    err.status = 401;
                    err.message = 'Tài khoản hết thời gian sử dụng';
                    let next_ = false;
                    if(req.url === '/login')
                        next_ = true;
                    let notGetUrl = ['/renters', '/owners', '/admins', '/users', '/typeUsers', '/roles'];
                    notGetUrl = notGetUrl.findIndex(url => url === req.url);
                    if(req.method === 'GET' && notGetUrl === -1)
                        next_ = true;

                    if(req.url === '/infoUser')
                        next(err);
                    if(next_) {
                        req.account = {
                            typeUser: {},
                            role: {}
                        }
                        next();
                    } else
                        next(err);
                    
                    
                }
                if(user) {
                    req.account = user.user;
                    next();
                }
            })
    } catch (error) {
        next(error);
    }
}

// catch error
function error404(error, req, res, next) {
    if (res.headersSent) {
        
        next(error);
    }
    
    next(error);
};

function error_server(error, req, res, next) {
    if(error.message.toLowerCase().indexOf('đăng nhập') !== -1)
        error.status = 401;
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,  
            message: error.message || 'Internal Server Error'
        }
    });
};

app.use('/', authenticateToken, router, error404, error_server);

//    error handler middleware

  


server.listen(port, function(){
    console.log('listening on port ' + port);
    
    io.on('connection', function (socket) {
      console.log("USER CONNECTED...");
  
      // handle new messages
      socket.on('new:message', function (msgObject) {
        io.emit('new:message', msgObject);
      });
  
      // handle new members
      socket.on('new:member', function (name) {
        io.emit('new:member', name);
      });
    });
  });

