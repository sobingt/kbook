var User = require('../models/User');

exports.index = function(req, res, next){
  User.find().exec(function(err, users){
    if(err)
      return err;
    var data = {
      users : users
    };
    res.render('index', data);
  });
	
}