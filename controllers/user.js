var userModel = require('../models/User');

var currentUserId= 1;
var isLoggedIn = true;

var getUserById = function(id){
  for(var i=0;i<userModel.usersData.length;i++)
  {
    if(id==userModel.usersData[i].id)
      return userModel.usersData[i];
  }
  return 0;
}
var getUserByEmail = function(email){
  for(var i=0;i<userModel.usersData.length;i++)
  {
    
    if(email==userModel.usersData[i].email)
      return userModel.usersData[i];
  }
  return 0;
}

var getUserByUsername = function(username){
  for(var i=0;i<userModel.usersData.length;i++)
  {
    if(username==userModel.usersData[i].username)
      return userModel.usersData[i];
  }
  return 0;
}

var populateFriendData = function(user) {
  for(var i=0; i< user.friends.length; i++)
  {
    if(user.friends[i].user_id)
    {
        var friendId = user.friends[i].user_id;
        var friend = getUserById(friendId);
        user.friends[i] = friend;
    }
    
  }
  return user;
}
var populateRequesterData = function(user) {
  for(var i=0; i< user.requests.length; i++)
  {
    if(!user.requests[i].user_id.id)
    {
        var requesterId = user.requests[i].user_id;
        var requester = getUserById(requesterId);
        user.requests[i].user_id = requester;
    }
    
  }
  return user;
}

//Get Current User Profile
exports.getCurrentUserProfile = function(req, res){
  var user =getUserById(currentUserId);
  var data = {
    user : user
  };
  res.render('profile',data);
}

//Get User Profile by ID
exports.getProfileById = function(req, res){
  var user =getUserById(req.params.id);
  if(user!=0)
  {
    var data = {
      user : user
    };
    res.render('profile',data);
  }
  else
    res.render('error404');
}


exports.getProfileByUsername = function(req, res)
{
  var user =getUserByUsername(req.params.username);
  var currentUser = getUserById(currentUserId);
  var isBlock = false;
  console.log(currentUser.blocked);
  for(var i =0; i<currentUser.blocked.length;i++)
  {
    if(currentUser.blocked[i].user_id==user.id)
      isBlock = true;
  }
  if(user!=0 && !isBlock)
  {
      var isFriend = false;
      if(user.friends)
      {
        user = populateFriendData(user);
        for(var i=0;i<user.friends.length;i++)
        {
          if(user.friends[i].id==currentUserId)
            isFriend = true;
        }
      }
      if(user.requests)
      {
        user = populateRequesterData(user);

      }
      var data = {
        user : user,
        isFriend: isFriend
      };
      res.render('profile',data);
  }
  else
    res.render('error404');
}

//Get User Profile
exports.getLogin = function(req, res){
  res.render('login');
}

//Get User Profile
exports.postLogin = function(req, res){
  var email=req.body.email;
  var password=req.body.password;
  var validUser = getUserByEmail(email);
  if(validUser)
  {
    res.redirect('/users/'+validUser.username);
  }
  else
  {
    req.flash('errors',{msg: "Error"});
    res.redirect('/login');
  }
}

//GET Add friend
exports.getAddFriend = function(req, res){
  var requesterId = req.params.username;
  var requester = getUserByUsername(requesterId);
  var currentUser = getUserById(currentUserId);
  if(!currentUser.friends)
    currentUser.friends = [];
  currentUser.friends.push({user_id : requester.id});
  for(var i=0;i<currentUser.requests.length;i++)
  {
    if(currentUser.requests[i].user_id.id==requester.id)
    {
      currentUser.requests.splice(i,1);
      
    } 
  }
  
  if(!requester.friends)
    requester.friends = [];
  requester.friends.push({user_id : currentUserId});

  res.redirect('/users/'+requesterId);
}

exports.getUnfriend=function(req,res){
  var requesteeUsername=req.params.username;
  var requestee= getUserByUsername(requesteeUsername);
  var currentUser = getUserById(currentUserId);
  for(var i=0;i<requestee.friends.length;i++)
  {
    if(requestee.friends[i].id==currentUserId)
    {
      requestee.friends.splice(i,1);
      
    } 
  }
  for(var i=0;i<currentUser.friends.length;i++)
  {
    if(currentUser.friends[i].user_id==requestee.id)
    {
      currentUser.friends.splice(i,1);
    }
  }
  res.redirect('/users/'+requesteeUsername)
}

exports.getIgnoreFriend = function(req, res){
  var requesterUsername=req.params.username;
  var requester= getUserByUsername(requesterUsername);
  var currentUser = getUserById(currentUserId);
  for(var i=0;i<currentUser.requests.length;i++)
  {
    if(currentUser.requests[i].user_id.id==requester.id)
    {
      currentUser.requests[i].status ="ignore"
    }
  }
  res.redirect("/users/"+currentUser.username);
}

exports.getBlockFriend = function(req, res){
  var requesterUsername=req.params.username;
  var requester= getUserByUsername(requesterUsername);
  var currentUser = getUserById(currentUserId);
  for(var i=0;i<currentUser.requests.length;i++)
  {
    if(currentUser.requests[i].user_id.id==requester.id)
    {
      currentUser.requests.splice(i,1);
      if(!currentUser.blocked)
        currentUser.blocked = [];
      else
        currentUser.blocked.push({user_id: requester.id})
    }
  }
  res.redirect("/users/"+currentUser.username);
}