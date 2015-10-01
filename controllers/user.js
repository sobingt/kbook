var userModel = require('../models/UserStatic');
var passport = require('passport');

var User = require('../models/User');







//Get Login Page
exports.getLogin = function(req, res){
  res.render('login');
}

//Post Login Request
exports.postLogin = function(req, res, next){
  var email=req.body.email;
  var password=req.body.password;
  passport.authenticate('local', function(err, user, info){
    if(err)
      return next(err);
    if(!user)
      return res.redirect('/login')
    req.logIn(user, function(err){
      if(err)
        return next(err);
      res.redirect('/');
    });
  })(req, res, next); 
}

//Get Signup Page
exports.getSignUp = function(req, res){
  res.render('signUp');
}
//Get Signup Page
exports.postSignUp = function(req, res){
  var fullname=req.body.fullname;
  var username=req.body.username;
  var email=req.body.email;
  var password=req.body.password;
  var user = new User({
    'fullname':fullname,
    'username': username,
    'email': email,
    'password': password
  });
  user.save(function(err,user){
    res.redirect('/');
  });
}

exports.getEditUser = function(req, res){
  User.findOne({'username': req.params.username}).exec(function(err,user){
    res.render('editUser',user);
  });

}

exports.postEditUser = function(req, res, next){
  var fullname=req.body.fullname;
  var id=req.body.id;
  var username=req.body.username;
  var email=req.body.email;
  var password=req.body.password;
  User.findById(id).exec(function(err,user){
    if (err) return next(err);
    user.fullname =fullname;
    user.username = username;
    user.password = password;
    user.email = email;
    user.save();
    res.redirect('/');
  });


}

exports.isLoggedIn= function(req, res, next){
  if(req.user)
    next();
  else
    res.redirect("/login");
}

exports.getProfile = function(req, res, next){
  var username = req.params.username;
  User.findOne({username: username}).populate('friends').populate('requests.user_id').exec(function(err, user){
    if(err)
      return next(err);
    if(!user)
      res.render('error404');
    for(var i=0; i<user.blocked.length;i++)
    {
      if(user.blocked[i].user_id.equals(req.user._id))
        return res.render('error404');
    }
    var isFriend = false;
   
    for(var i=0;i < user.friends.length;i++)
    {
      //console.log(user.friends[i]);
      //console.log(req.user);
      if(user.friends[i]._id.equals(req.user._id))
      {
        isFriend = true;
      }
         
    }
    var mutualFriends=[];
    for(var i=0;i<user.friends.length;i++)
    {
      for(var j=0;j<req.user.friends.length;j++)
      {
        if(user.friends[i]._id.equals(req.user.friends[j]))
          mutualFriends.push(user.friends[i].username);
      }
    }
    var data = {
      user : user,
      isFriend : isFriend,
      mutualFriends: mutualFriends
    }
    res.render('profile',data);
  });
}

exports.addRequest=function(req,res,next){
  var username=req.params.username;
  User.findOne({username: username}).exec(function(err, user){
    if(!user)
      return res.render("error404");
    user.requests.push({
        user_id: req.user._id,
        status: "new"
    });
    user.save();
    res.redirect('/users/'+user.username);
  });
}

exports.addFriend = function(req, res, next){
  var username = req.params.username;
  User.findOne({username: username}).exec(function(err, user){
    if(!user)
      return res.render("error404");
    //console.log(req.user.friends);
    req.user.friends.push(user._id);
    for(var i=0;i<req.user.requests.length;i++)
    {
        if(req.user.requests[i].user_id.equals(user._id))
        {
          req.user.requests.splice(i,1);
        }
    }
    user.friends.push(req.user._id);
    user.save();
    req.user.save();
    res.redirect("/users/"+user.username);
  });

}

exports.unfriend = function(req, res, next){
  var username = req.params.username;
  User.findOne({username: username}).exec(function(err, user){
    if(!user)
      return res.render("error404");
    for(var i=0;i<user.friends.length;i++)
    {
      if(user.friends[i].equals(req.user._id))
      {
        user.friends.splice(i,1);
      } 
    }
    
    for(var i=0; i<req.user.friends.length;i++)
    {
      if(req.user.friends[i].equals(user._id))
      {
        req.user.friends.splice(i,1);
      } 
    }
    user.save();
    req.user.save();
    res.redirect("/users/"+user.username);
  });
}

exports.ignoreFriend = function(req, res, next){
  var username = req.params.username;
  User.findOne({username: username}).exec(function(err, user){
    for(var i=0;i<req.user.requests.length;i++)
      {
        if(req.user.requests[i].user_id.equals(user._id))
        {
          req.user.requests[i].status ="ignore";
          req.user.save();
        }
      }
    res.redirect("/users/"+req.user.username);
  });
}

exports.blockFriend = function(req, res, next){
  var username=req.params.username;
  User.findOne({username: username}).exec(function(err, user){
    for(var i=0;i<req.user.requests.length;i++)
    {
      if(req.user.requests[i].user_id.equals(user._id))
      {
        req.user.requests.splice(i,1);
        if(!req.user.blocked)
          req.user.blocked = [];
        else
        { 
          req.user.blocked.push({user_id: user._id})
          req.user.requests[i].status ="block";
          req.user.save();
        }      
      }
    }
    res.redirect("/users/"+req.user.username);
});
}

