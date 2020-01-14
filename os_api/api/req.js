const express = require('express')
var utility = require('utility')
let router = express.Router();

/**注册接口 */
router.get('/c2s_register', function (req, res, next) {
    let phone = req.query.phone;
    let secret = req.query.secret;
    app.redis_cli.hget("register", phone, function (err, result) {
        if (err) {
            res.json({
                code: 1,
                err: JSON.stringify(err)
            })
        } else {
            if (result == null) {
                app.redis_cli.hset("register", phone, new Date().getTime(), function (err, result) {
                    app.redis_cli.hlen("register", function (err, len) {
                        let pid = 100000 + len;
                        let md5secret = utility.md5(secret)
                        app.redis_cli.hmset("user_" + phone, "phone", phone, "secret", md5secret, "id", pid)
                        app.redis_cli.hset("id_phone_map", pid, phone)
                        res.json({
                            code: 0,
                            msg: "注册成功"
                        })
                    })
                })
            } else {
                res.json({
                    code: 1,
                    msg: "该手机号已注册"
                })
            }
        }

    })
})

/**登陆接口 */
router.get('/c2s_login', function (req, res, next) {
    let phone = req.query.phone;
    let secret = req.query.secret;
    app.redis_cli.hget("register", phone, function (err, result) {
        if (err) {
            res.json({
                code: 1,
                err: JSON.stringify(err)
            })
        } else {
            if (result == null) {
                res.json({
                    code: 1,
                    msg: "该手机号未注册"
                })
            } else {
                app.redis_cli.hget("user_" + phone, "secret", function (err, orgsec) {
                    if (orgsec == utility.md5(secret)) {
                        let token = utility.md5(phone + secret + new Date().getTime())
                        app.redis_cli.hset("user_" + phone, "token", token, function (err, result) {
                            app.redis_cli.hmget("user_" + phone, "id", function (err, result) {
                                res.json({
                                    code: 0,
                                    msg: "登陆成功",
                                    data: {
                                        token: token,
                                        id: result[0]
                                    }
                                })
                            })
                        })
                    } else {
                        res.json({
                            code: 1,
                            msg: "密码错误",
                        })
                    }
                })
            }
        }
    })
})

module.exports = router