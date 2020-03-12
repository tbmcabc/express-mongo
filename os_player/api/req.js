const express = require('express')
var urlencode = require('urlencode')
var crypto = require('crypto')
let router = express.Router();
let recieveid = "ww0d1c5329d824145e"
let encodingAesKey = "BkkFobAFthA5mU8gfRnMvMBRUMuLRvSybQMNi7fo7IO";
let token = "RcCeXOhFuQ76AC9HlyWXiTBioampfa";
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
    let echostr1 = urlencode.decode(req.query.echostr);
    let echostr = req.query.echostr;
    console.log(echostr)
    console.log(echostr1)

    let timestamp = req.query.timestamp;
    let nonce = req.query.nonce
    let str = verifyUrl(msg_signature, timestamp, nonce, echostr)

    console.log(str)
    res.send(str)
})


function verifyUrl(msg_signature, timestamp, nonce, echostr) {
    // console.log(encodingAesKey.length)
    if (encodingAesKey.length != 43) {
        return "false"
    }
    let sha1 = crypto.createHash('sha1')

    let params = [token,timestamp,nonce,echostr]
    // console.log(params)
    params.sort()
    // console.log(params)
    let d1 = sha1.update(params[0]+params[1]+params[2]+params[3]).digest("hex")
    // // let key = Base64.decode(encodingAesKey +"=")
    // let base64 = new Base64()

    // // 密钥 32 位
    let aeskey  = Buffer.from(encodingAesKey + '=',"base64")
    let s =  aeskey
    // console.log(s)
    // console.log(s.length)
    // // // 初始向量 initial vector 16 位
    let iv  = s.slice(0,16)

    // console.log(echostr)

    

    let encryptedText =Buffer.from(echostr,'base64');

    // let decipher =crypto.createDecipheriv('aes-256-cbc',aeskey, iv);

    // let decrypted =decipher.update(encryptedText);

    // decrypted =Buffer.concat([decrypted,decipher.final()]);

     
    //解密
    var decrypted = CryptoJS.AES.decrypt(encryptedText, aeskey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
     
    console.log(decrypted)
    // // 转换为 utf8 字符串
    // decrypted = aesutil.decryption(echostr,key1,'')
    // console.log("加密的结果：" + d1)
    if(d1 != msg_signature){
        return "false"
    }else{
        //对密文进行base64解码
        return "true"
    }
    return "newEchostr"
}



module.exports = router