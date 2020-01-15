const express = require('express')
let router = express.Router();

router.get('/c2s_createroom', function (req, res, next) {
    let pid = req.query.id;
    let token = req.query.token;
    myapp.api_redis.hget("id_phone_map", pid, function (err, phone) {
        if (!phone) {
            myapp.api_redis.hmget("room_" + pid)
        } else {
            res.json({
                code: 1,
                msg: "没有找到该玩家"
            })
        }
    })
})

module.exports = router