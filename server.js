//Importing node libaries
var express = require('express');
var	favicon = require('serve-favicon');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var homeController = require('./controllers/home');
var userController = require('./controllers/user');
//Express Object
var app = express();

//Configing app object
app.use(express.static(path.join(__dirname,"public")));
//Create a dev loggger for dev environment
//TODO remove dev logger in producation
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(favicon(path.join(__dirname,"favicon.ico")));

//Setting App paramaters
//Set views folder as your views render directory
app.set('views',path.join(__dirname,'views'));
//Set jade as view engine
app.set('view engine','jade');

//Routers
//Home Page route
app.get('/',homeController.index);

//GET Profile Page
app.get('/profile',userController.getProfile);

//Start server at port 3000
app.listen(3000,function(){
	console.log("Server is running at 3000");
});