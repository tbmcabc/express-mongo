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
var xml2js = require('xml2js');



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

router.post('/requestapi', function (req, res, next) {
    let msg_signature = req.query.msg_signature;    
    let timestamp = req.query.timestamp;
    let nonce = req.query.nonce
    console.log(req.query)    
    req.rawBody = ''; //添加接收变量
    var json = {};
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        req.rawBody += chunk;
    });
    req.on('end', function () {
        xml2js.parseString(req.rawBody,  {explicitArray : false}, function(err, xmlmsg) {
            let echostr = xmlmsg.xml.Encrypt
            let d1 = getSignature(timestamp,nonce,echostr)
            if (d1 != msg_signature){
                res.send("false")
                console.log(false)
            }else{
                res.send()                
                xml2js.parseString(decryptStr(echostr),  {explicitArray : false}, function(err, realmsg) {
                    console.log(realmsg)
                })
            }
        })        
    });    
})



function verifyUrl(msg_signature, timestamp, nonce, echostr) {
    if (encodingAesKey.length != 43) {
        return "false"
    }
    let d1 = getSignature(timestamp, nonce, echostr);
    if (d1 != msg_signature) {
        return "false"
    } else {
        return decryptStr(echostr)
    }
}

function decryptStr(echostr){
    //获取aeskey          
    let aesKey = Buffer.from(encodingAesKey + '=', 'base64');
    //获得初始向量
    let iv = aesKey.slice(0, 16)
    //构造解密函数
    let aesCipher = require("crypto").createDecipheriv("aes-256-cbc", aesKey, iv);
    aesCipher.setAutoPadding(false);
    let decipheredBuff = Buffer.concat([aesCipher.update(echostr, 'base64'), aesCipher.final()]);
    var pad = decipheredBuff[decipheredBuff.length - 1];
    if (pad < 1 || pad > 32) {
        pad = 0;
    }
    decipheredBuff.slice(0, decipheredBuff.length - pad);
    //去掉前16位
    let len_netOrder_corpid = decipheredBuff.slice(16);
    //计算4位msg_len
    let msg_len = len_netOrder_corpid.slice(0, 4).readUInt32BE(0);
    //获得明文
    let result = len_netOrder_corpid.slice(4, msg_len + 4).toString();
    return result;
}

function decryptMsg(msg_signature, timestamp, nonce, echostr) {
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
        //获取aeskey          
        let aesKey = Buffer.from(encodingAesKey + '=', 'base64');
        //获得初始向量
        let iv = aesKey.slice(0, 16)
        //构造解密函数
        let aesCipher = require("crypto").createDecipheriv("aes-256-cbc", aesKey, iv);
        aesCipher.setAutoPadding(false);
        let decipheredBuff = Buffer.concat([aesCipher.update(echostr, 'base64'), aesCipher.final()]);
        var pad = decipheredBuff[decipheredBuff.length - 1];
        if (pad < 1 || pad > 32) {
            pad = 0;
        }
        decipheredBuff.slice(0, decipheredBuff.length - pad);
        //去掉前16位
        let len_netOrder_corpid = decipheredBuff.slice(16);
        //计算4位msg_len
        let msg_len = len_netOrder_corpid.slice(0, 4).readUInt32BE(0);
        //获得明文
        let result = len_netOrder_corpid.slice(4, msg_len + 4).toString();
        return result;
    }
}

// 消息加密
function encryptMsg(replyMsg) {
    let aesKey = Buffer.from(encodingAesKey + '=', 'base64');
    let iv = aesKey.slice(0, 16)
    var random16 = require("crypto").pseudoRandomBytes(16);
    var msg = new Buffer(replyMsg);
    var msgLength = new Buffer(4);
    msgLength.writeUInt32BE(msg.length, 0);
    var corpid = new Buffer(recieveid);
    var rawMsg = Buffer.concat([random16, msgLength, msg, corpid]);
    var cipher = require("crypto").createCipheriv('aes-256-cbc', aesKey, iv);
    var cipheredMsg = Buffer.concat([cipher.update(rawMsg), cipher.final()]);
    var encrypt = cipheredMsg.toString('base64');

    var nonce = parseInt((Math.random() * 10000000000), 10);
    var time = timestamp();

    var msgsignature = getSignature(time, nonce, encrypt);
    // 标准回包
    var resXml = `<xml><Encrypt><![CDATA[${encrypt}]]></Encrypt><MsgSignature><![CDATA[${msgsignature}]]></MsgSignature><TimeStamp>${time}</TimeStamp><Nonce><![CDATA[${nonce}]]><Nonce></xml>`;

    return resXml;
}

function getSignature(timestamp, nonce, echostr) {
    let sha1 = crypto.createHash('sha1')
    let params = [token, timestamp, nonce, echostr]
    params.sort()
    let d1 = sha1.update(params[0] + params[1] + params[2] + params[3]).digest("hex")
    return d1
}


module.exports = router