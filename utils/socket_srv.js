var socket_io = require('socket.io')

var socketio = {};

// 获取io

socketio.getSocketio = function (server) { // http(s) server

    var io = socket_io.listen(server);

    io.sockets.on('connection', function (socket) {

        console.log('连接成功');

        socket.on('event01', function () { // 处理来自客户端的’event01’事件

            console.log('监听点击事件');

            var datas = [1, 2, 3, 4, 5];

            socket.emit('event02', {
                datas: datas
            }); // 给该客户端发送event02事件

            socket.broadcast.emit('event02', {
                datas: datas
            }); // 发送给其它客户端

        })

        // 更多事件，就更多处理函数

        // ......

    })

};

module.exports = socketio;