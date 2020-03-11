const express = require('express')
var urlencode = require('urlencode')
var crypto = require('crypto')
let router = express.Router();
let recieveid = "ww0d1c5329d824145e"
let encodingAesKey = "BkkFobAFthA5mU8gfRnMvMBRUMuLRvSybQMNi7fo7IO";
let token = "RcCeXOhFuQ76AC9HlyWXiTBioampfa";

const aesutil = require('../../utils/aesutil')


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
    let echostr = urlencode.decode(req.query.echostr);
    let timestamp = req.query.timestamp;
    let nonce = req.query.nonce
    let str = verifyUrl(msg_signature, timestamp, nonce, echostr)

    console.log(str)
    res.send(str)
})


function verifyUrl(msg_signature, timestamp, nonce, echostr) {
    console.log(encodingAesKey.length)
    if (encodingAesKey.length != 43) {
        return "false"
    }
    let sha1 = crypto.createHash('sha1')
    let d1 = sha1.update(token + timestamp + nonce + echostr).digest("hex")
    console.log("加密的结果：" + d1)
    if(d1 != msg_signature){
        return "false"
    }else{
        return "true"
    }

    console.log(msg_signature)


    return "newEchostr"
}



module.exports = router