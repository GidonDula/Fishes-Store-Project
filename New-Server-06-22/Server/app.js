const express = require("express");
const app = express();
const crypto = require('crypto');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require("cors");
const process = require('process');
const bodyParser = require("body-parser");
dotenv.config();
const logger = require('morgan');
const { DBUser } = require("./DB/dBUser");
DBUser.createUserSchema();

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

const sessionStore = new MongoStore({ mongooseConnection: DBUser.connection, collection: 'sessions' });
app.use(session({
    secret: "process.env.SECRET",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
}));

app.use(cors());

const userRoutes = require('./Routes/UserRoutes');
const productRoutes = require('./Routes/ProductRoutes');
const ordersRoutes = require('./Routes/OrderRoutes');

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');

const io = require('socket.io')();
require('./socket')(io)

//app.use(bodyParser.json());
let jsonParser = bodyParser.json({ limit: 1024 * 1024 * 10, type: 'application/json' });
let urlencodedParser = bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 10, type: 'application/x-www-form-urlencoded' });
app.use(jsonParser);
app.use(urlencodedParser);

app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use('/User', userRoutes);
app.use('/Product', productRoutes);
app.use('/Order', ordersRoutes);


const HTTPS_PORT = 3063;
//const HTTP_PORT = 3064;


var https = require('https');
var http = require('http');
var debug = require('debug')('FishesStoreProject:server');

var port = normalizePort(process.env.PORT || HTTPS_PORT);
app.set('port', port);

const fs = require("fs");
const url = require("url");

// const privateKey = fs.readFileSync('/etc/letsencrypt/live/rt-dev.xyz/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/rt-dev.xyz/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/rt-dev.xyz/chain.pem', 'utf8');

// const credentials = {
//     key: privateKey,
//     cert: certificate,
//     ca: ca
// };





/**
 * Create HTTPS server.
 */

var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

/*s*
 * Listen on provided port, on all network interfaces.
 */

httpServer.listen(port, () => {
    console.log("listening on https on port 3063");
});
httpServer.on('error', onError);
httpServer.on('listening', onListening);

io.attach(httpServer);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = httpServer.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}

app.use(express.static(__dirname + '/public/'));

app.get("/", (req, res) => {
    res.set({ "Access-control-Allow-origin": "*" });
    res.sendFile(path.join(__dirname, '../Server/public/index.html'))
        //return res.redirect("index.html");
});