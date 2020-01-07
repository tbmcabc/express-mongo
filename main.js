global.app = require("./app_srv");
let cfg = require('./config/config')
var RedisManager = require('./utils/redis_cli')

let redis = new RedisManager(cfg.rediscfg, app)

app.start();