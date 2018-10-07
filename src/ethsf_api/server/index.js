require("babel-core/register");
require("babel-polyfill");

// port
let port = 5000
let io_port = 5001

import express from 'express'
const app = express()


import bodyParser from 'body-parser'
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

import multer from 'multer';

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


const api = require('./routes/ethef_api.js');
app.post('/api/userService', api.userService);

// soket IO
const io = require('socket.io')();
io.on('connection', (client) => {
  // here you can start emitting events to the client
  console.log("soket io ready:")
});
io.listen(io_port);
app.io = io

app.listen(port);
console.log('Server test, Listening on port '+port+'...');
