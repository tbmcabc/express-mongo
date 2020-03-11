const express = require('express')
let router = express.Router();


router.get('/c2s_request', function (req, res, next) {
    res.send("ok")
})

router.get('/c2s_redisset', function (req, res, next) {    
    app.redis_cli.hset("hash1", "vv", "1", function (err, result) {
        if (err) {
            res.json({
                code: 1,
                err: JSON.stringify(err)
            })
        }
        if (result != null) {
            res.json({
                code: 0,
                result: JSON.stringify(result)
            })
        }
    })
})

router.get('/c2s_redisget', function (req, res, next) {    
    app.redis_cli.hget("hash1", "vv", function (err, result) {
        if (err) {
            res.json({
                code: 1,
                err: JSON.stringify(err)
            })
        }
        if (result != null) {
            res.json({
                code: 0,
                result: JSON.stringify(result)
            })
        }
    })    
})

router.get('/requestapi', function (req, res, next) {    
    let msg_signature = req.query.msg_signature;
    let echostr = req.query.echostr;
    let timestamp = req.query.timestamp
    console.log(msg_signature)
    console.log(echostr)
    console.log(timestamp)

    res.send()
})



module.exports = router