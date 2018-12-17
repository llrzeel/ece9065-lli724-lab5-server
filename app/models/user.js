var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema  = new Schema({
    userName: String,
    email: String,
    password: String,
    role: String,
    status: String,
    enabled: String
});
module.exports = mongoose.model('User', UserSchema);