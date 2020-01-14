var WebSocket = require('ws')
const url = require('url');

var clientarr = []

// 获取io
class socketio {

    getSocketio(server) { // http(s) server
        let self = this;
        this.wss = new WebSocket.Server({
            server
        }); 

        this.wss.on('connection', function connection(ws, req) {

            const location = url.parse(req.url, true);
            // You might use location.query.access_token to authenticate or share sessions
            // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
            clientarr.push(ws)
            ws.sid = clientarr.length;            
            ws.on('message', function incoming(message) {
                console.log('received: %s', message);
                ws.send(message);
            });
            ws.on('error', function (err) {
                ws.close()
            });

            ws.on("close", function (data) {
                self.wsClose(ws, data)
            });

            ws.send('something');
        });

        this.wss.on("listening", function () {
            console.log(`listening`);
        });

    };


    wsClose(ws, data) {        
        if (!ws.sid) return;        
        delete this.wss.clients[Number(ws.sid - 1)]
    };

    sayHello(msg) {
        this.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        });
    };

    checkClientCount() {
        // return clientarr.length;
        let len = 0
        this.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                len++;
            }
        });
        return len;
    };

}

module.exports = socketio;