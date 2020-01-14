module.exports = function (app) {
    // 分发api模块，比如用户的注册和登录请求业务逻辑将会在/api/user.js中实现    
    app.use('/api', require('../api/api'));
    app.use('/api', require('../api/req'));
};