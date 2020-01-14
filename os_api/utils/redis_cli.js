class RedisManager {

    constructor(cfg, app) {
        let redis = require('redis')        
        app.redis_cli = redis.createClient(cfg.rediscfg)
        app.redis_cli.on('error', function (err) {
            console.log(err);
        });
        app.redis_cli.on('ready', function (err) {});
        app.redis_cli.on('connect', function () {
            console.log(`redis  connect success`);
        })
    }
}

module.exports = RedisManager;