// call the packages
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods","DELETE,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Content-Type','application/json;charset=utf-8');
  next();
});

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/fruits');

var port = process.env.PORT || 8080;
// var Bear = require('./app/models/bear');
var Fruit = require('./app/models/fruit');
// ROUTES FOR OUR API

var router = express.Router();


// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); 
});


// // test route(accessed at GET http://localhost:8080/api)
// router.get('/', function(req, res) {
//     res.json({ message: 'hooray! welcome to our api!' });   
// });

// route service
router.route('/fruits')
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        console.log(req);
        var fruit = new Fruit();      // create a new instance of the Bear model
        
        if(req.body.name !== undefined){
            fruit.name = req.body.name;
        }
        
        if(req.body.price !== undefined && !isNaN(req.body.price)){
            fruit.price = req.body.price;
        }

        if(req.body.taxrate !== undefined && !isNaN(req.body.taxrate)){
            fruit.taxrate = req.body.taxrate;
        }
        if(req.body.quantity !== undefined && !isNaN(req.body.quantity)){
            fruit.quantity = req.body.quantity;
        }
        
        console.log('new fruit',req.body.name);
        // console.log(req);
        // save the bear and check for errors
        fruit.save(function(err) {
            if (err){
                res.send(err);
            }
            res.json({ message: 'Fruit created!' });
        });

    })
    
    .get(function(req,res){
        console.log('request all');
        Fruit.find(function(err, fruit){
            if (err){
                res.send(err);
            }
            res.json(fruit);
        });
    });
    
router.route('/fruits/:fruit_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Fruit.findById(req.params.fruit_id, function(err, fruit) {
            if (err){
                res.send(err);
            }
            res.json(fruit);
        });
    })
    
    .put(function(req, res) {

        // use our bear model to find the bear we want
        Fruit.findById(req.params.fruit_id, function(err, fruit) {

            if (err){
                console.log("1");
                res.send(err);
            }
            console.log(fruit);
            console.log(req.body.quantity);
            console.log(req.body.taxrate);
            if(req.body.quantity !== undefined && !isNaN(req.body.quantity)){
                
                fruit.quantity = req.body.quantity;
                console.log(fruit.quantity);
            }
            if(req.body.taxrate !== undefined && !isNaN(req.body.taxrate)){
                fruit.taxrate = req.body.taxrate;
            }
            
            // save
            fruit.save(function(err) {
                if (err){
                    console.log("3");
                    res.send(err);
                }
                res.json({ message: 'Fruit updated!' });
            });

        });
    })
    
    .delete(function(req, res) {
        Fruit.deleteOne({
            _id: req.params.fruit_id
        }, function(err, fruit) {
            if (err){
                
                res.send(err);
            }
            res.json({ message: 'Successfully deleted' });
        });
    });

router.route('/users')
    .get(function(req, res) {
        
        
        
    })
    .put(function(req, res) {
        
    })



app.use('/api',router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);