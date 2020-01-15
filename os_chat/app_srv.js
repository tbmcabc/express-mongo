var express = require('express');
var http = require('http')
var cfg = require('./config/config')
var app = express();
var socketio = require('../utils/socket_srv')

global.logger = require('../utils/log4js').logger;
httpLogger = require('../utils/log4js').httpLogger;

app.use(httpLogger);

app.set('port', process.env.PORT || 3000);
app.use(require('body-parser')());

// app.use(require('express-logger')({
//     path: __dirname + '/log/request.log'
// }))

app.use(express.static(__dirname + '/public'));


app.start = function () {
    this.timecount = 0;
    let http_srv = http.createServer(app);
    this.io = new socketio()
    this.io.getSocketio(http_srv)
    http_srv.listen(cfg.port);
};

app.timerfun = function () {
    this.timecount++;
    if (this.timecount % 5 == 0) {
        console.log("当前在线人数:" + this.io.checkClientCount())
    }
}


module.exports = app;