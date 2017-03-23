var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var db = require('./config.js');
var SALT_WORK_FACTOR = 10;

module.exports = {
	checkAuth: function(req, res, next) {
		var token = req.headers['x-access-token'];
		if (!token) {
			next(new Error('No Token!'));
		} 
		else {
			var user = jwt.decode(token, 'secret');
			User.findOne({email: user.email})
			.then(function(user) {
				if (user) {
					res.send(200);
				}
				else {
					res.send(401);
				}
			})
			.fail(function(err) {
				next(err);
			});
		}
	},

	hashPass: function(password, callback) {
		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
			if (err) {
				callback(err, null);
			}
			else {
				bcrypt.hash(password, salt, null, function(err, result) {
					if (err) {
						callback(err, null);
					}
					else {
						callback(null, result);
					}
				});
			}
		});
	},

	checkPass: function(user, pass, callback) {
		db.select().from('users')
		.where('email', user)
		.then(function(user) {	
			bcrypt.compare(pass, user[0].password, function(err, isMatch) {
				if (err) {
					console.log('pass error ', err);
					callback(err, null);
				}
				else {
					console.log('match ', isMatch);
					callback(null, isMatch);
				}
			});
		});
	}	
};
