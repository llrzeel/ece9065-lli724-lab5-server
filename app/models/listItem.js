var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ListItemSchema  = new Schema({
    listName:String,
    itemName:String,
    ItemQuantity:Number
});
module.exports = mongoose.model('ListItem', ListItemSchema);