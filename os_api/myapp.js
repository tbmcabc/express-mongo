const RedisManager = require('../utils/redis_cli')
class MyApp {
    constructor() {
        global.app_srv = require("./app_srv");
        this.cfg = require('./config/config')
        this.rediscfg = require('../global_cfg/config').REDIS_CFG;
        this.api_redis = new RedisManager("api_redis", this.rediscfg["db_api"], "os_api_sha");
        this.db_com = new RedisManager("db_com", this.rediscfg.db_com, null);
    }

    lanuch() {
        //app start
        app_srv.start();

        
    }
}

module.exports = MyApp;