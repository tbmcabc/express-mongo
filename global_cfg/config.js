var REDIS_CFG = {};
var LOG_CFG = {};

REDIS_CFG.db_com = {
    ip: "127.0.0.1",
    port: 6379,
    db: 0
}

REDIS_CFG.db_api = {
    ip: "127.0.0.1",
    port: 6379,
    db: 1
}

REDIS_CFG.db_player = {
    ip: "127.0.0.1",
    port: 6379,
    db: 2
}


module.exports = {
    REDIS_CFG: REDIS_CFG,
    LOG_CFG: LOG_CFG
}