// call the packages
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

var nev = require('email-verification')(mongoose);
const bcrypt = require('bcrypt');
const saltRounds = 10;


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

// configure email 
nev.configure({
    verificationURL: 'https://ece9065-lli724-lab5-server-lilongrui.c9users.io/email-verification/${URL}',
    persistentUserModel: User,
    tempUserCollection: 'myawesomewebsite_tempusers',
 
    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'zeel56mani@gmail.com',
            pass: '56attila'
        }
    },
    verifyMailOptions: {
        from: 'Do Not Reply <zeel56mani@gmail.com>',
        subject: 'Please confirm account',
        html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
        text: 'Please confirm your account by clicking the following link: ${URL}'
    }
}, function(error, options){
});

nev.generateTempUserModel(User);
 

var TempUser = require('./app/models/user');
nev.configure({
    tempUserModel: TempUser
}, function(error, options){
});

// ------------------
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/fruits');

var port = process.env.PORT || 8080;

var Fruit = require('./app/models/fruit');
var Comment = require('./app/models/comment');
var User = require('./app/models/user');
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

// route service fruit
// =============================================================================
router.route('/fruits')
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        // console.log(req);
        var fruit = new Fruit();
        
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
        if(req.body.totalSale !== undefined && !isNaN(req.body.totalSale)){
            fruit.totalSale = req.body.totalSale;
        }
        console.log('new fruit',req.body.name);
        // save
        fruit.save(function(err) {
            if (err){
                res.send(err);
            }
            console.log("fruit created");
            res.json({ message: 'Fruit created!' });
        });

    })
    
    .get(function(req,res){
        console.log('request all fruit');
        Fruit.find(function(err, fruit){
            if (err){
                res.send(err);
            }
            res.json(fruit);
        });
    });
    
router.route('/fruits/:fruit_id')
    
    // get fruit by id
    .get(function(req, res) {
        Fruit.findById(req.params.fruit_id, function(err, fruit) {
            if (err){
                res.send(err);
            }
            res.json(fruit);
        });
    })
    // update fruit by id
    .put(function(req, res) {
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
            if(req.body.totalSale !== undefined && !isNaN(req.body.totalSale)){
                fruit.totalSale = req.body.totalSale;
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


// route service user
// =============================================================================
router.route('/user')

    // userName: String,
    // email: String,
    // password: Number,
    // role: String,
    // status: String,
    // enabled: String
    .post(function(req, res) {
        // console.log(req);
        //check role
        //............................
        
        
        let user = new User();
        
        if(req.body.userName !== undefined){
            user.userName = req.body.userName;
        }
                if(req.body.email !== undefined){
            user.email = req.body.email;
        }
        // need check password
        if(req.body.password !== undefined){
            console.log("saving pw");
            let hashPassword = bcrypt.hashSync(req.body.password, saltRounds);
            // console.log(hashPassword);
            user.password=hashPassword;
            
        }

        if(req.body.role !== undefined){
            user.role = req.body.role;
        }
        if(req.body.status !== undefined){
            user.status = req.body.status;
        }
        if(req.body.enabled !== undefined){
            user.enabled = req.body.enabled;
        }
        
        
        console.log('new user',user.password);
        // console.log(req);
        // save the bear and check for errors
        user.save(function(err) {
            if (err){
                res.send(err);
            }
            res.json({ message: 'user created!' });
        });

    })
    
    .get(function(req,res){
        console.log('request all user');
        User.find(function(err, user){
            if (err){
                res.send(err);
            }
            
            res.json(user);
        });
    });


router.route('/user/:userid')
    
    // get by id
    .get(function(req, res) {
        User.findById(req.params.userid, function(err, user) {
            if (err){
                res.send(err);
            }
            res.json(user);
        });
    })
    // update by id
    .put(function(req, res) {
        User.findById(req.params.userid, function(err, user) {

            if (err){
                console.log("1");
                res.send(err);
            }
            console.log(user);
        if(req.body.userName !== undefined){
            user.userName = req.body.userName;
        }
                if(req.body.email !== undefined){
            user.email = req.body.email;
        }
        // need check password
        if(req.body.password !== undefined){
            user.password = req.body.password;
        }

        if(req.body.role !== undefined){
            user.role = req.body.role;
        }
        if(req.body.status !== undefined){
            user.status = req.body.status;
        }
        if(req.body.enabled !== undefined){
            user.enabled = req.body.enabled;
        }
            
            // save
            user.save(function(err) {
                if (err){
                    console.log("3");
                    res.send(err);
                }
                res.json({ message: 'user updated!' });
            });

        });
    })
    
    .delete(function(req, res) {
        User.deleteOne({
            _id: req.params.userid
        }, function(err, user) {
            if (err){
                
                res.send(err);
            }
            res.json({ message: 'user deleted' });
        });
    });
    
    // route service comment
// =============================================================================
router.route('/comments')
    // itemName: String,
    // userName: String,
    // comment: String,
    // rate: Number,
    // state: Number
    .post(function(req, res) {
        console.log(req);
        //check role
        //............................
        
        
        let comment = new Comment();
        
        if(req.body.itemName !== undefined){
            comment.itemName = req.body.itemName;
        }
        if(req.body.userName !== undefined){
            comment.userName = req.body.userName;
        }

        if(req.body.comment !== undefined){
            comment.comment = req.body.comment;
        }
        if(req.body.rate !== undefined){
            comment.rate = req.body.rate;
        }
        if(req.body.state !== undefined){
            comment.state = req.body.state;
        }
        
        
        console.log('new comment',req.body.userName);
        // console.log(req);
        // save the bear and check for errors
        comment.save(function(err) {
            if (err){
                res.send(err);
            }
            res.json({ message: 'comment created!' });
        });
        
        Comment.find(function(err, comment){
            if (err){
                console.log(err);
            }
            console.log(comment);
        });
 
    })
    
    .get(function(req,res){
        // console.log();
        if(req.query.itemName!== undefined){
            console.log("query comment by item name");
            Comment.find({itemName:req.query.itemName},function(err, comment){
                if (err){
                    res.send(err);
                }
                res.json(comment);
            });
            
        }else{
            console.log('request all comment');
            Comment.find(function(err, comment){
                if (err){
                    res.send(err);
                }
                res.json(comment);
            });
            
        }
    });


router.route('/comments/:commentid')
    
    // get by id
    .get(function(req, res) {
        // console.log(req);
        console.log("query comment by id",req.query.itemName);
        Comment.findById(req.params.commentid, function(err, comment) {
            if (err){
                res.send(err);
            }
            res.json(comment);
        });
    })
    // update by id
    .put(function(req, res) {
        Comment.findById(req.params.commentid, function(err, comment) {

            if (err){
                console.log("1");
                res.send(err);
            }
            console.log(comment);
        if(req.body.itemName !== undefined){
            comment.itemName = req.body.itemName;
        }
        if(req.body.userName !== undefined){
            comment.userName = req.body.userName;
        }

        if(req.body.comment !== undefined){
            comment.comment = req.body.comment;
        }
        if(req.body.rate !== undefined){
            comment.rate = req.body.rate;
        }
        if(req.body.state !== undefined){
            comment.state = req.body.state;
        }
            
            // save
            comment.save(function(err) {
                if (err){
                    console.log("3");
                    res.send(err);
                }
                res.json({ message: 'comment updated!' });
            });

        });
    })
    
    .delete(function(req, res) {
        Comment.deleteOne({
            _id: req.params.commentid
        }, function(err, comment) {
            if (err){
                
                res.send(err);
            }
            res.json({ message: 'comment deleted' });
        });
    });
    

router.route('/login/:action')
.get(function(req, res) {

    if(req.params.action=='login'){
            if(req.query.user!== undefined&&req.query.password!=undefined){
            console.log("query user login");
            User.find({email:req.query.user},function(err, user){
                if (err){
                    console.log("query user error:",err);
                    res.send(err);
                }
                if(user.length==0){
                   loginFail(res);
                   return;
                }
                // console.log(user[0],user[0].name,user[0].password);
                let passwordMatch =bcrypt.compareSync(req.query.password,user[0].password);
                console.log(passwordMatch);
                
                if(passwordMatch){
                    
                    // actived account
                    loginSuccess(res,user[0]);
                    
                }else{
                    loginFail(res);
                    return;
                }
            });
            return;
            
        }
    }
    if(req.params.action=='logout'){
            console.log("query user logout",req.query.user);
            if(req.query.user!== undefined){
                
                res.send('200');
                User.find({email:req.query.user},function(err, user){
                    if (err){
                        console.log("query user error:",err);
                        res.send(err);
                    }
                    if(user.length==0){
                        
                        return;
                    }
                    user[0].status='0';

                    user[0].save(function(err) {
                        if (err){
                            console.log("update user error");
                        }

                    });
                });
                    
                    
            }
                
        }

}).put(function(req, res) {
    
});

function loginFail(res){
    res.send('404');
}

function loginSuccess(res,user){
    if(user.enabled==1){
        // login status
        user.status=1;
        
        let data = {user:user.userName,role:user.role};
        res.json(data);
    }else{
        res.send('401');
    }
    
}



app.use('/api',router);

// START THE SERVER
app.listen(port);