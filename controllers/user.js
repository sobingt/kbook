var usersData=[
  {
    'id': 1,
    'username': 'karthikv',
    'fullname': 'Karthik V',
    'age': '21',
    'gender': 'Male',
    'college': 'Xavier',
    'city': 'Mumbai',
    'email' : 'karthik.v1993@yahoo.com',
    'password': '123',
    'role': 'admin'
  },
  {
    'id': 2,
    'username': 'sobingt',
    'fullname': 'Sobin George Thomas',
    'age': '27',
    'gender': 'Male',
    'college': 'Xavier',
    'city': 'Mumbai',
    'email' : 'sobingt@gmail.com',
    'password': '123',
    'role': 'user'
  }

];

var currentUserId= 1;
var isLoggedIn = true;

var getUserById = function(id){
  for(var i=0;i<usersData.length;i++)
  {
    if(id==usersData[i].id)
      return usersData[i];
  }
  return 0;
}
var getUserByEmail = function(email){
  for(var i=0;i<usersData.length;i++)
  {
    console.log(i);
    if(email==usersData[i].email)
      return usersData[i];
  }
  return 0;
}

//Get Current User Profile
exports.getCurrentUserProfile = function(req, res){
  var user =getUserById(currentUserId);
  var data = {
    user : user
  };
  res.render('profile',data);
}

//Get User Profile
exports.getUserProfile = function(req, res){
  var user =getUserById(req.params.id);
  var data = {
    user : user
  };
  res.render('profile',data);
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
    res.redirect('/users/'+validUser.id);
  }
  else
    res.redirect('/login');
}

