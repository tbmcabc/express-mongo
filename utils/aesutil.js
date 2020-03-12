var crypto = require('crypto');

var aesutil = module.exports = {};

/**
 * aes加密
 * @param data 待加密内容
 * @param key 必须为16位私钥
 * @returns {string}
 */
aesutil.encryption = function (data, key, iv) {
    iv = iv || "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    return cipherChunks.join('');
}

/**
 * aes解密
 * @param data 待解密内容
 * @param key 必须为16位私钥
 * @returns {string}
 */
aesutil.decryption = function (crypted, key, iv) {
    if (!crypted) {
        return "";
    }
    // let padding = AES_conf.padding;
    crypted = new Buffer(crypted, 'base64').toString('binary');
    var decipher = crypto.createDecipher('aes-128-cbc', key,'');
    var decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
}