var express = require('express');

var bodyparser = require('body-parser'); // read HTML from a website

var expHBS = require('express-handlebars');
var path = require('path');


var logger = require('morgan');

var app = express();

//set port for express
app.set('PORT', process.env.PORT || 3000);

// Use morgan for logging requests
app.use(logger('dev'));

//server static content from public directory
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// set handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expHBS({ extname: 'handlebars', defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// import routes and give the server access to them
var routes = require('./controllers/scraper_controller');
app.use(routes);

app.listen(app.get('PORT'), () => {
    console.log('Server running on port: ', app.get('PORT'));
});