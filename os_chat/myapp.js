var RedisManager = require('../utils/redis_cli')
class MyApp {
    constructor() {
        global.app = require("./app_srv");
        this.cfg = require('./config/config')
        this.rediscfg = require('../global_cfg/config').REDIS_CFG;
        this.db_api = new RedisManager("os_api", this.rediscfg.db_api, null);
        this.db_com = new RedisManager("db_com", this.rediscfg.db_com, null);
    }

    lanuch() {
        //app start
        app.start();

        this.registerSubcribeEvent()

        if (this.cfg.timeinterval > 0) {
            app.timer = setInterval(() => {
                if (app.timerfun) {
                    app.timerfun()
                }
            }, this.cfg.timeinterval)
        }
        let self = this

        this.db_com.call("on", "message", function (channel, msg) {
            self.ReceiveRedisMsg(channel, msg)
        })
    }

    registerSubcribeEvent() {
        this.db_com.call("SUBSCRIBE", "channelapi2chat")
        this.db_com.call("SUBSCRIBE", "reply_notify")
    }

    ReceiveRedisMsg(channel, msg) {
        let key = "on" + channel;
        let func = this[key]
        if (func) {
            func(msg)
        }
    }

    on_channelapi2chat(msg) {
        console.log(msg)
    }


}

module.exports = MyApp;