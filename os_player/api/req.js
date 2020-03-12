const express = require('express')
var urlencode = require('urlencode')
var crypto = require('crypto')
let router = express.Router();
let recieveid = "ww0d1c5329d824145e"
let encodingAesKey = "aszrgmMaa9UVZdluGbgJPqXqNnFO6xabTKIJrXRCQPr";
let token = "VPG6WzQ1pviIxkf97vxCZoxWvl7puV";
const aesutil = require('../../utils/aesutil')
var CryptoJS = require('crypto-js')
var Base64 = require('../../utils/base64')


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
    if (encodingAesKey.length != 43) {
        return "false"
    }
    let sha1 = crypto.createHash('sha1')

    let params = [token, timestamp, nonce, echostr]

    params.sort()

    let d1 = sha1.update(params[0] + params[1] + params[2] + params[3]).digest("hex")

    


    if (d1 != msg_signature) {
        return "false"
    } else {
        //对密文进行base64解码        
        return _decode(Buffer.from(echostr, 'base64'))        
    }
}

function _decode(data) {
    let aesKey = Buffer.from(encodingAesKey + '=', 'base64');
    let aesCipher = require("crypto").createDecipheriv("aes-256-cbc", aesKey, aesKey.slice(0, 16));
    aesCipher.setAutoPadding(false);
    let decipheredBuff = Buffer.concat([aesCipher.update(data, 'base64'), aesCipher.final()]);
    decipheredBuff = PKCS7Decoder(decipheredBuff);
    let len_netOrder_corpid = decipheredBuff.slice(16);
    let msg_len = len_netOrder_corpid.slice(0, 4).readUInt32BE(0);
    const result = len_netOrder_corpid.slice(4, msg_len + 4).toString();
    return result; // 返回一个解密后的明文-
}

function PKCS7Decoder (buff) 
{
    var pad = buff[buff.length - 1];
    if (pad < 1 || pad > 32) {
      pad = 0;
    }
    return buff.slice(0, buff.length - pad);
}



module.exports = router