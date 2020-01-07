class MyApp {
    constructor() {
        global.app = require("./app_srv");
        this.cfg = require('./config/config')
    }

    lanuch() {
        app.start();
        var RedisManager = require('./utils/redis_cli')
        let redis = new RedisManager(this.cfg.rediscfg, app)
    }
}

module.exports = MyApp;