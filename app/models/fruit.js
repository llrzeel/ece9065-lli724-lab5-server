var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FruitSchema   = new Schema({
    name: String,
    price: Number,
    taxrate: Number,
    quantity: Number,
    totalSale: Number
});
module.exports = mongoose.model('Fruit', FruitSchema);