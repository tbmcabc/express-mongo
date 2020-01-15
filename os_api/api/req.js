const express = require('express')
var utility = require('utility')
let router = express.Router();

/**注册接口 */
router.get('/c2s_register', function (req, res, next) {
    let phone = req.query.phone;
    let secret = req.query.secret;
    myapp.api_redis.evalsha("db_check_register", 0, phone, function (err, result) {
        if (err) {
            res.json({
                code: 1,
                err: JSON.stringify(err)
            })
        } else {
            if (result == null) {
                let md5secret = utility.md5(secret)
                myapp.api_redis.evalsha("db_player_register", 0, phone, new Date().getTime(), md5secret, function (err, ret) {
                    if (err) {
                        // console.log(err)
                        res.json({
                            code: 1,
                            msg: "db server error"
                        })
                    } else {
                        // console.log(result)
                        res.json({
                            code: 0,
                            msg: "注册成功"
                        })
                    }
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
    myapp.api_redis.call("hget", "register", phone, function (err, result) {
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

                myapp.api_redis.evalsha("db_check_player_login", 0, phone, utility.md5(secret), function (err, ret) {
                    if (err) res.json({
                        code: 1,
                        err: "db server error"
                    })
                    if (ret != null) {
                        switch (Number(ret)) {
                            case 1:
                                res.json({
                                    code: 1,
                                    msg: "没有找到该玩家",
                                })
                                break;
                            case 2:
                                res.json({
                                    code: 2,
                                    msg: "密码错误",
                                })
                                break;
                            default:
                                let token = utility.md5(phone + secret + new Date().getTime())
                                myapp.api_redis.call("hset", "user_" + ret, "token", token, function (err, result) {})
                                res.json({
                                    code: 0,
                                    msg: "登陆成功",
                                    data: {
                                        token: token,
                                        id: ret
                                    }
                                })
                                break;
                        }
                    }
                })
            }
        }
    })
})

module.exports = router