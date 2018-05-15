const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;

// db connectivity
var mongoURI;

mongoose.connection.on("open", function(ref) {
  console.log("Connected to mongo server.");
  return;
});

mongoose.connection.on("error", function(err) {
  console.log("Could not connect to mongo server!");
  return console.log(err);
});

mongoURI = "mongodb://localhost/test";

var mongoconnection = mongoose.connect(mongoURI);

// import collection 
var User = require('./models/user');

// logger function
const logger = (req, res, next) => {
	console.log('Router middleware is called');
	next();
}

var router = express.Router();
// middleware to use for all requests
router.use(logger);
router.get('/', function(req, res){
	res.json({ message: 'hooray ! welcome to our api'})
});

// post method to save user
const saveUser = (req, res) => {
	let user = new User();
	user.name = req.body.name;
	user.save(err => {
		if(err){
			res.send(err);
		}
		res.json({ message: 'User Created' })
	});
}

// get method to get all users
const getUsers = (req, res) => {
	User.find((err, users) => {
		if(err){
			res.send(err);
		}
		res.json(users);
	})
}

// update user by id
const updateUsers = (req, res) => {
	User.findById(req.params.user_id, (err, user) => {
		if(err){
			res.send(err);
		}
		user.name = req.body.name;
		user.save(err => {
			if(err){
				res.send(err);
			}
			res.json({ message: "User updated!"})
		});
	});
}

// delete the user
const deleteUser = (req, res) => {
	User.remove({
		_id:req.params.user_id
	}, (err, user)=> {
		if(err){
			res.send(err);
		}
		res.json({ message: 'successfully deleted' });
	});
}
// TODO - get the single user
const getUser = (req, res) => {
	User.findById(req.params.user_id, (err, user) => {
		if(err){
			res.send(err);
		}
		console.log('getUser api returns ', user);
		res.json(user);
	});
}

//ROUTES  for models
router.route('/users')
.post((req,res) => saveUser(req, res))
.get((req, res) => getUsers(req, res));

router.route('/users/:user_id')
.get((req, res) => getUser(req, res))
.put((req, res) => updateUsers(req, res))
.delete((req, res) => deleteUser(req, res));

app.use('/api', router);

app.listen(port);


console.log('Running on port ' + port);


