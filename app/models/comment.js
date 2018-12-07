var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CommentSchema  = new Schema({
    itemId: String,
    userId: String,
    comment: String,
    rate: Number
});
module.exports = mongoose.model('Comment', CommentSchema);