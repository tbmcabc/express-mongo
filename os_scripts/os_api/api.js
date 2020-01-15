const RedisCFG = require('../../global_cfg/config').REDIS_CFG;
const redis = require('redis');

let scripts = {}


scripts.db_check_register = `
    local phone = ARGV[1]
    local key = "register"

    return redis.call("hget", key, phone)
`

scripts.db_player_register = `
    local phone = ARGV[1]
    local timestep = ARGV[2]
    local md5secret = ARGV[3]

    redis.call("hset","register", phone, timestep)

    local len = redis.call("hlen", "register")
    local pid = 100000 + len

    local userkey = "user_"..pid

    redis.call("hmset", userkey, "phone", phone, "secret", md5secret, "pid", pid)

    redis.call("hset", "phone_id_map", phone, pid)

    return cjson.encode({id=pid})
`

scripts.db_check_player_login = `
    local phone = ARGV[1]    
    local orgmd5secret = ARGV[2]

    local pid = redis.call("hget", "phone_id_map", phone)

    if not pid then
        return 1
    end

    local md5secret = redis.call("hget", "user_"..pid, "secret")

    if md5secret ~= orgmd5secret then
        return 2
    end

    return pid
`



// -------------------------------------------------------------------------------
// prototype modifies
// -------------------------------------------------------------------------------

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

String.prototype.Format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,
        function (m, i) {
            return args[i];
        });
}


// -------------------------------------------------------------------------------
// help functions
// -------------------------------------------------------------------------------

function print() {
    var a = arguments
    var str = "console.log(new Date().Format('hh:mm:ss.S')"
    for (var i = 0; i < a.length; ++i) str += ',a[' + i + ']';
    eval(str + ')')
}

function chkerror(err) {
    if (err) {
        print(err);
        throw "chkerror";
    }
}


function uploadScript(client, key) {
    client.script("load", scripts[key], function (err, ret) {
        chkerror(err)
        print("upload", key, ret)
        client.hset("os_api_sha", key, ret)
        client.hset("os_api_src", key, scripts[key])
    });
}

function loadAllScripts() {
    let cfg = RedisCFG["db_api"]
    let redis_client = redis.createClient(cfg);
    redis_client.on('error', function (err) {
        console.log(err)
    });

    redis_client.on('ready', function (err) {

    });

    redis_client.on('connect', function () {
        for (let key in scripts) {
            uploadScript(redis_client, key)
        }
    });
}
loadAllScripts()

setTimeout(function () {
    console.log("exit")
    process.emit("exit", function () {})
}, 3000)