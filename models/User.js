var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    fullname: String,
    age: Number,
    gender: {
        type: String,
        default: 'Male'
    },
    username: String,
    password: String
});

module.exports = mongoose.model('User', userSchema);