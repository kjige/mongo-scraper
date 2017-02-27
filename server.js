var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var express = require("express");
var exphbs = require("express-handlebars");
var methodOverride = require("method-override");
var logger = require("morgan");
var mongoose = require("mongoose");
var Promise = require("bluebird");
var request = require("request");

mongoose.Promise = Promise;

// express app
var app = express();

// port
var PORT = process.env.PORT || 3000;

// logger
app.use(logger("dev"));

// public
app.use(express.static(__dirname + '/public'));

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// method-override
app.use(methodOverride('_method'));

// handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// localhost connection
// mongoose.connect('mongodb://localhost/');

// heroku connection
mongoose.connect('mongodb://heroku_xnm40xhc:lacfnre3jrcmddqh4o1c58j56e@ds161059.mlab.com:61059/heroku_xnm40xhc');

var db = mongoose.connection;

// when connection errors happen
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// successful connection to mongodb
db.once("open", function() {
    console.log("Mongoose connected!");
});

// server listening
app.listen(PORT, function(){
  console.log("Listening on port: " + PORT);
});

// routes
require('./routes/routes.js')(app);