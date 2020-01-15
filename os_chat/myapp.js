var RedisManager = require('../utils/redis_cli')
class MyApp {
    constructor() {
        global.app = require("./app_srv");
        this.cfg = require('./config/config')
        this.rediscfg = require('../global_cfg/config').REDIS_CFG;
        this.db_api = new RedisManager("os_api", this.rediscfg.db_api, null);
        this.db_api_sub = new RedisManager("os_api_sub", this.rediscfg.db_api, null);
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
    }

    registerSubcribeEvent() {
        this.db_api_sub.call("SUBSCRIBE", "apichannel")
    }
}

module.exports = MyApp;