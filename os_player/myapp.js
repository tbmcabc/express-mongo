class MyApp {
    constructor() {
        global.app = require("./app_srv");
        this.cfg = require('./config/config')
    }

    lanuch() {
        //app start
        app.start();
        //redis switch
        if (this.cfg.connectredis) {
            console.log("连接redis 配置" + JSON.stringify(this.cfg.rediscfg))
            var RedisManager = require('../utils/redis_cli')
            let redis = new RedisManager(this.cfg.rediscfg, app);
        } else {
            console.log("不使用redis")
        }
        //timer switch
        if (this.cfg.usetimer && this.cfg.timeinterval > 0) {
            console.log("使用定时器配置 间隔时间" + this.cfg.timeinterval + "ms")
            app.timer = setInterval(() => {
                if (app.timerfun) {
                    app.timerfun()
                }
            }, this.cfg.timeinterval)
        } else {
            console.log("不使用定时器配置")
        }
    }
}

module.exports = MyApp;