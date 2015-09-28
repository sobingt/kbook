var usersData=[
  {
    'id': 1,
    'username': 'karthikv',
    'name' : 'Karthik',
    'fullname': 'Karthik V',
    'age': '21',
    'gender': 'Male',
    'college': 'Xavier',
    'city': 'Mumbai',
    'email' : 'karthik.v1993@yahoo.com',
    'password': '123',
    'role': 'admin',
    'pic' : "https://graph.facebook.com/100000384512724/picture?type=large"
  },
  {
    'id': 2,
    'username': 'sobingt',
    'name' : 'Sobin',
    'fullname': 'Sobin George Thomas',
    'age': '27',
    'gender': 'Male',
    'college': 'Xavier',
    'city': 'Mumbai',
    'email' : 'sobingt@gmail.com',
    'password': '123',
    'role': 'user',
    'pic' : "https://graph.facebook.com/100000483391087/picture?type=large"
  },
  {
    'id': 3,
    'username': 'akshayiyer378',
    'name' : 'Akshay',
    'fullname': 'Akshay Iyer',
    'age': '22',
    'gender': 'Male',
    'college': 'NL',
    'city': 'Mumbai',
    'email' : 'akshayiyer@gmail.com',
    'password': '123',
    'role': 'user',
    'pic': "https://graph.facebook.com/689038812/picture?type=large"
  },
  {
    'id': 4,
    'username': 'alistermendes',
    'name' : 'Alister',
    'fullname': 'Akshay Mendes',
    'age': '22',
    'gender': 'Male',
    'college': 'Xavier',
    'city': 'Mumbai',
    'email' : 'alistermendes@gmail.com',
    'password': '123',
    'role': 'user',
    'pic': "https://graph.facebook.com/100000100366602/picture?type=large"
  },  
  {
    'id': 5,
    'username': 'joaquimfranco146',
    'name' : 'Joaquim',
    'fullname': 'Joaquim Franco',
    'age': '22',
    'gender': 'Male',
    'college': 'Xavier',
    'city': 'Mumbai',
    'email' : 'joaquim@gmail.com',
    'password': '123',
    'role': 'user',
    'pic': "https://graph.facebook.com/100002427628807/picture?type=large"
  },
  {
    'id': 6,
    'username': 'heenalunadkat',
    'name' : 'Heenal',
    'fullname': 'Heenal Unadkat',
    'age': '22',
    'gender': 'Female',
    'college': 'Xavier',
    'city': 'Mumbai',
    'email' : 'heenal@gmail.com',
    'password': '123',
    'role': 'user',
    'pic': "https://graph.facebook.com/100000027807245/picture?type=large"
  },
  {
    'id': 7,
    'username': 'shrutik.k7',
    'name' : 'Shrutik',
    'fullname': 'Shrutik Katchhi',
    'age': '22',
    'gender': 'Male',
    'college': 'Xavier',
    'city': 'Mumbai',
    'email' : 'shrutik.k7@gmail.com',
    'password': '123',
    'role': 'user',
    'pic': "https://graph.facebook.com/100000272199579/picture?type=large"
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

var getUserByUsername = function(username){
  for(var i=0;i<usersData.length;i++)
  {
    if(username==usersData[i].username)
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

exports.getProfile = function(req, res){
  var user =getUserByUsername(req.params.username);
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
    res.redirect('/users/'+validUser.username);
  }
  else
    res.render('error404');
}
