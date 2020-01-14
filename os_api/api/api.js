const express = require('express')
let router = express.Router();

router.get('/c2s_createroom', function (req, res, next) {
    let pid = req.query.id;
    let token = req.query.token;
    app.redis_cli.hget("id_phone_map", pid, function (err, phone) {
        if (!phone) {
            app.redis_cli.hmget("room_"+pid)
        } else {
            res.json({
                code: 1,
                msg: "没有找到该玩家"
            })
        }
    })
})

module.exports = router