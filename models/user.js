let mongoose = require('mongoose');
let plm = require('passport-local-mongoose');

let user = new mongoose.Schema({
    username: { 
        type: String,
        required: true
    },
    password: {
        type: String,
        // required: true,
        minLength: 8
    }
});

// indicate this model extends Passport Local Mongoose for auth
user.plugin(plm);

module.exports = mongoose.model('User', user);