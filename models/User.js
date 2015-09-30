var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    token: Array,
    fullname: String,
    age: Number,
    gender: {
        type: String,
        default: 'Male'
    },
    username: String,
    password: String,
    facebook: String,
    pic: String
});

module.exports = mongoose.model('User', userSchema);