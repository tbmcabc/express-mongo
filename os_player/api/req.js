const express = require('express')
var urlencode = require('urlencode')
let router = express.Router();

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


    res.send(str)
})


function verifyUrl(msg_signature, timestamp, nonce, echostr) {
    let str = new Buffer.from('aszrgmMaa9UVZdluGbgJPqXqNnFO6xabTKIJrXRCQPr'+ "=", "base64")
    let AESKey = str.toString()
    console.log(AESKey.length)
    let newEchostr = "";
    console.log("msg_signature \n" + msg_signature)
    console.log("echostr \n" + echostr)
    console.log("timestamp \n" + timestamp)
    console.log("nonce \n" + nonce)    
    let randommsg = aesutil.decryption(echostr,str)
    console.log(randommsg)

    return newEchostr
}



module.exports = router