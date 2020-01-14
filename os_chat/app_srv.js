var express = require('express');
var http = require('http')
var cfg = require('./config/config')
var app = express();
var socketio = require('../utils/socket_srv')

global.logger = require('../utils/log4js').logger;
httpLogger = require('../utils/log4js').httpLogger;

app.use(httpLogger);

var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) {
                this._sections = {};
            }
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(require('body-parser')());

// app.use(require('express-logger')({
//     path: __dirname + '/log/request.log'
// }))

app.use(express.static(__dirname + '/public'));
app.use(function (req, res, next) {
    if (!res.locals.partials) {
        res.locals.partials = {};
    }
    res.locals.partials.weather = getWeatherData();
    next();
});

// app.listen(app.get('port'), function () {
//     console.log('Express started on http://localhost:' + app.get('port') + ';press ctrl-c to terminate');
// })

app.start = function () {
    this.timecount = 0;
    let http_srv = http.createServer(app);
    this.io = new socketio()
    this.io.getSocketio(http_srv)
    http_srv.listen(cfg.port);
};

var fortunes = [
    "Conquer your fears or they will conquer you.",
    "sdfasfasdf",
    "345234523542",
    "35d4g35sd5gds35g4sg",
    "dfkjakdfh",
]

function getWeatherData() {
    return {
        locations: [{
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}

app.timerfun = function () {
    this.timecount++;
    if (this.timecount % 5 == 0) {
        this.io.sayHello("当前在线人数:" + this.io.checkClientCount())

    }
    if (this.timecount % 2 == 0) {
        console.log("当前服务器连接人数" + this.io.checkClientCount() + " " + new Date().getTime())

    }


}


module.exports = app;