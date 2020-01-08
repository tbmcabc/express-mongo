const express = require('express')
let router = express.Router();


router.get('/', function (req, res, next) {
    console.log(req.url)
    res.json({
        name: "first",
        age: "18"
    })
})

router.get('/c2s_test', function (req, res, next) {
    console.log(req.url)
    res.json({
        name: "secound",
        age: "18"
    })
})

router.get('/c2s_getcount', function (req, res, next) {
    console.log(req.url)
    res.json({
        code: "0",
        count: global.app.timecount
    })
})

module.exports = router