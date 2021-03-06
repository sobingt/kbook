//Importing node libaries
var express = require('express');
var	favicon = require('serve-favicon');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
//Controllers
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var passportConfig = require('./config/passport');
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
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true },
  store: new MongoStore({
    url: 'mongodb://localhost:27017/kbook',
    autoReconnect: true
  })
}));

app.use(flash());
app.use(function(req, res, next){
  res.locals.errors = req.flash('errors');
  next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

mongoose.connect("mongodb://localhost:27017/kbook");
mongoose.connection.on('error',function(){
  console.log("Please connect to the MongoDb Server. There is a mongodb connection error.");
  process.exit(1);
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
//Post Login Request
app.post('/login',userController.postLogin);

app.get('/signUp',userController.getSignUp);
app.post('/signUp',userController.postSignUp);

app.get('/edit/:username',userController.getEditUser);
app.post('/edit/:username',userController.postEditUser);

app.get('/users/:username', userController.getProfile);
app.get('/addFriend/:username', userController.isLoggedIn, userController.addFriend);
app.get('/addRequest/:username', userController.isLoggedIn, userController.addRequest); 
app.get('/unfriend/:username', userController.isLoggedIn, userController.unfriend);
app.get('/ignoreFriend/:username', userController.isLoggedIn, userController.ignoreFriend);
app.get('/blockFriend/:username', userController.isLoggedIn, userController.blockFriend);
// //GET Profiles by Username in Homepage
// app.get('/users/:username', userController.getProfileByUsername);

// //Request to Add as Friend
// app.get('/requestAddFriend/:username', userController.getAddFriend);

// //GET Add ad Friend
// app.get('/addFriend/:username', userController.getAddFriend);

// //GET Ignore Friend
// app.get('/ignoreFriend/:username', userController.getIgnoreFriend);
// //GET Block Friend
// app.get('/blockFriend/:username', userController.getBlockFriend);

// //Unfriend request
// app.get('/unFriend/:username',userController.getUnfriend);

// //UnblockFriend request
// app.get('/unblockFriend/:username',userController.getUnblockFriend);

// //GET Current User Profile Page
// app.get('/profile',userController.getCurrentUserProfile);

// app.get('/error500', function(){});

//Third path auth Routes
app.get('/auth/facebook',passport.authenticate('facebook', { scope: ['email']}));
app.get('/auth/facebook/callback',passport.authenticate('facebook',{failureRedirect: '/login'}),function(req, res){
  res.redirect('/');
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
//Start server at port 3000
app.listen(3000,function(){
	console.log("Server is running at 3000");
});
