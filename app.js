var express = require('express');
var app = express();
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

app.use(express.static(__dirname + '/public'));
app.use(function (req, res, next) {
    if (!res.locals.partials) res.locals.partials = {};
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

app.get('/newsletter', function (req, res) {
    // 我们会在后面学到CSRF……目前，只提供一个虚拟值
    res.render('newsletter', {
        csrf: 'CSRF token goes here'
    });
});
// app.post('/process', function (req, res) {
//     // 这里通过 req.query 和 req.body出来表单数据
//     console.log('Form (from querystring): ' + req.query.form);
//     console.log('CSRF token (from hidden form field): ' + req.body._csrf);
//     console.log('Name (from visible form field): ' + req.body.name);
//     console.log('Email (from visible form field): ' + req.body.email);
//     // 这里303重定向到/thank-you 页面
//     res.redirect(303, '/thank-you');
// });

app.post('/process', function(req, res){
    // 这里用于判断如果是一个ajax请求着去处理，否则重定向到/thank-you
    if(req.xhr || req.accepts('json,html')==='json'){
        // 如果发生错误，应该发送 { error: 'error description' }
        res.send({ success: true });
    } else {
        // 如果发生错误，应该重定向到错误页面
        res.redirect(303, '/thank-you');
    }
});

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

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + ';press ctrl-c to terminate');
})

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