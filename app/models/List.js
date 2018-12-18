var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ListSchema  = new Schema({
    userName: String,
    listName:String,
    Description:String,
    visiblity:Boolean
});
module.exports = mongoose.model('List', ListSchema);