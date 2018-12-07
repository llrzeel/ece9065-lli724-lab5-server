var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema  = new Schema({
    userId: String,
    password: Number,
    role: String,
    status: String,
    enabled: String
});
module.exports = mongoose.model('User', UserSchema);