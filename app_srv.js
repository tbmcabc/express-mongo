var express = require('express');
var http = require('http')
var cfg = require('./config/config')
var app = express();
var io = require('./utils/socket_srv')


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
app.use(require('express-logger')({
    path: __dirname + '/log/request.log'
}))

app.use(express.static(__dirname + '/public'));
app.use(function (req, res, next) {
    if (!res.locals.partials) {
        res.locals.partials = {};
    }
    res.locals.partials.weather = getWeatherData();
    next();
});

app.get('/', function (req, res) {
    res.render('home')
})

app.get('/about', function (req, res) {
    var randomfor = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', {
        fortune: randomfor
    })
})



app.use('/api', require('./router/req'))
app.use('/api', require('./router/api'))


//404
app.use(function (req, res) {
    res.status(404);
    res.render('404')
})

//500
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500')
})

// app.listen(app.get('port'), function () {
//     console.log('Express started on http://localhost:' + app.get('port') + ';press ctrl-c to terminate');
// })

app.start = function () {
    this.timecount = 0;
    let http_srv = http.createServer(app);
    io.getSocketio(http_srv)
    http_srv.listen(cfg.port);
    http_srv.on('listening', function () {
        var addr = http_srv.address();
        var bind = typeof addr === 'string' ?
            'pipe ' + addr :
            'port ' + addr.port;
        console.log("srv start at:" + bind)
    })



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
    console.log(this.timecount)
}


module.exports = app;