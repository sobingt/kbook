var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/User');

passport.serializeUser(function(user, done){
  return done(null, user._id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    return done(err, user);
  });
});

/**
  * passport.use(Strategy({options},callback function))
  *
  *
 **/
passport.use(new LocalStrategy({usernameField: 'email'},function(email, password, done){
  email = email.toLowerCase();
  User.findOne({'email': email},function(err, user){
    if(!user)
      return done(null, false, {message: 'Email '+email+' not found'});
    if(user.password == password)
      return done(null, user);
    else
      return done(null, false, {message: 'Combination of the email and password is wrong'});
  }); 

}));

passport.use(new FacebookStrategy({ 
    clientID: '1666416613575436', 
    clientSecret: '162cb61fc4a9c53e3284e014c985faa7', 
    callbackURL: '/auth/facebook/callback', 
    passReqToCallback: true 
  },function(req, accessToken, refreshToken, profile, done){
  //check if facebook id give us a user object or null
    if(req.user)
    {
    //there is a user object coming in this scope

    //Check if the user is already registed in the database by his/her facebook id
      User.findOne({facebook : profile.id},function(err, user){
        if(user)
        {
          //Exsiting User from facebook
          console.log("User already registed with facebook");
          return done(err);
        }
        else
        {
          //user is not registered with facebook 
          User.findOne({email: profile._json.email}, function(err, user){
            if(user)
            {
              user.facebook = profile.id;
              user.token.push({ type: 'facebook', accessToken: accessToken});
              user.fullname = user.fullname || profile.displayName;
              user.gender = user.gender || profile._json.gender;
              user.pic = user.pic || 'https://graph.facebook.com/'+ profile.id + '/picture?type=large';
              user.save(function(err){
                console.log('Profile Updated');
                done(err, user);
            });
          }
          else
          {
            //New User
            var user = new User();
            user.facebook = profile.id;
            user.token.push({ type: 'facebook', accessToken: accessToken});
            user.fullname = profile.displayName;
            user.gender = profile._json.gender;
            user.email = profile._json.email;
            user.pic = 'https://graph.facebook.com/'+ profile.id + '/picture?type=large';
            user.save(function(err){
              console.log('Profile Created');
              done(err, user);
            });

          }

        });
      }


    });

  }}));
