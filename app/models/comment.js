var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CommentSchema  = new Schema({
    itemName: String,
    userName: String,
    comment: String,
    rate: Number,
    status: Number
});
module.exports = mongoose.model('Comment', CommentSchema);