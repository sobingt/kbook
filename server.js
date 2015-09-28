//Importing node libaries
var express = require('express');
var	favicon = require('serve-favicon');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
//Controllers
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
app.use(session({
  secret: 'Theg7',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(flash());
app.use(function(req, res, next){
  res.locals.errors = req.flash('errors');
  res.locals.currentUserId= 1;
  next();
});

//Setting App paramaters
//Set views folder as your views render directory
app.set('views',path.join(__dirname,'views'));
//Set jade as view engine
app.set('view engine','jade');

//Routers
//Home Page route
app.get('/',homeController.index);


//GET user Profile Page
//app.get('/users/:id',userController.getUserProfile);

//GET Login Page
app.get('/login',userController.getLogin);

//GET Profiles by Username in Homepage
app.get('/users/:username', userController.getProfileByUsername);

//Add Friend request
app.get('/addFriend/:username', userController.getAddFriend);

//Unfriend request
app.get('/unFriend/:username',userController.getUnfriend);

//GET Current User Profile Page
app.get('/profile',userController.getCurrentUserProfile);

app.get('/error500', function(){});

app.post('/login',userController.postLogin);
//Start server at port 3000
app.listen(3000,function(){
	console.log("Server is running at 3000");
});
