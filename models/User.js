var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    id: Number,
    name: String,
    college: String,
    city: String,
    role: String,
    email: {
        type: String,
        unique: true
    },
    friends: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    blocked: Array,
    token: Array,
    requests: [{
                user_id: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
                status: String
            }],
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