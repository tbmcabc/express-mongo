var WebSocket = require('ws')
const url = require('url');
var socketio = {};
var clientarr = []

// 获取io

socketio.getSocketio = function (server) { // http(s) server

    this.wss = new WebSocket.Server({
        server
    });

    this.wss.on('connection', function connection(ws, req) {
        const location = url.parse(req.url, true);        
        // You might use location.query.access_token to authenticate or share sessions
        // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
        clientarr.push(ws)
        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
            ws.send(message);
        });

        ws.send('something');
    });
};


socketio.sayHello = function (msg) {

    this.wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
};

socketio.checkClientCount = function () {        
    return clientarr.length;
};

module.exports = socketio;