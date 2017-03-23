/*jshint esversion: 6 */
var db = require('../config/config.js');
var bcrypt = require('bcrypt-nodejs');
var helpers = require('../config/helpers.js');
var jwt = require('jwt-simple');



module.exports = {

	getUsers: function (callback) {
		db.select().from('users')
			.then(function (users) {
				callback(null, users);
			}).catch(function (err) {
				callback(err);
			});
	},

	signin: function(user, password, callback) {
		helpers.checkPass(user, password, function(err, match) {
			if (err) {
				callback(err);
			}
			else {
				callback(null, match);
			}
		});
	},

	signup: function (user, callback) {
		console.log('user being created: ', user);
		helpers.hashPass(user.password, function(err, result) {
			db('users').insert({
				name: user.name,
				email: user.email,
				password: result,
				profile_url: user.profile_url
			}).then((inserted) => {
				db.select().from('users').where('email', user.email)
				.then(newUser => {
					var token = jwt.encode(newUser, 'secret');
					callback(null, token); 
				});
			}).catch((err) => {
				callback(err);
			});
		});
	},

	updateUser: function (user, callback) {
		console.log('user has been updated with ', user);
		db('users').where('email', user.email)
			.update({
				profile_url: user.profile_url,
				hang: user.hang
			})
			.then((updated) => {
				if (updated) {
					callback(null, updated);
				}
				else {
					callback('Error updating');
				}
			});
	}
	// getGuests

};