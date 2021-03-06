const redis = require('redis')
class RedisCli {

    constructor(name, cfg, sha) {
        this._name = name;
        this._sha = sha;
        this.auth = false;
        this._cfg = cfg;

        if (cfg.auth == null) this.auth = true

        this.client = redis.createClient(cfg.rediscfg)
        let self = this
        this.client.on('error', function (err) {
            console.log(err);
        });
        this.client.on('ready', function (err) {

        });
        this.client.on('connect', function () {
            console.log(`redis ${name}  connect success`);
            if (cfg.auth != null) {
                self.client.auth(cfg.auth, function (err, ret) {
                    self.auth = true;
                    self.loadAllScripts()
                })
            } else {
                self.auth = true;
                self.loadAllScripts();
            }
        })
    }

    loadAllScripts() {
        if (this._sha == null) return;
        let self = this;
        this.client.hgetall(this._sha, function (err, ret) {
            if (err) return console.log(err);
            console.log(`load ${self._sha} success`);
            console.log(ret);
        })
    }

    call(cmd, ...params) {
        if (this.auth) {
            this.client[cmd].call(this.client, ...params);
        } else {
            let self = this
            this.client.auth(this._cfg.auth, function (err, ret) {
                self.auth = true;
                self.client[cmd].call(self.client, ...params);
            })
        }
    }

    evalsha(key, ...params) {
        let self = this

        if (this.auth) {
            this.client.hget(this._sha, key, function (err, sha) {
                if (err) return console.log(err);
                self.client.evalsha(sha, ...params);
            });
        } else {
            this.client.auth(this._cfg.auth, function (err, ret) {
                self.auth = true;
                self.client.hget(self._sha, key, function (err, sha) {
                    if (err) return console.log(err);
                    self.client.evalsha(sha, ...params);
                });
            })
        }


    }
}

module.exports = RedisCli;