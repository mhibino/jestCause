/*jshint esversion: 6 */
/* friendController */

var Friend = require('./friendModel');
var db = require('../config/config');

module.exports = {

	getFriends: function(req, res, next) {
		console.log('GETTING FRIENDS - REQ: ', req);
		var userEmail = req.headers.email;
		Friend.getFriends(userEmail, function(err, friends) {
			if(err) {
				next(new Error('Couldn\'t get your friends.'));
			} else {
				res.send({ error: false, message: 'Sending your friends', data: friends });
			}
		});
	},

	addFriend: function(req, res, next) {
		// return checkFriendCombo(req, res, next)
		console.log('Inside friendController-ADD-FRIEND...');
		var userEmail = req.headers.email;
		console.log('L27: userEmail: ', userEmail);
		var friendEmail = req.headers.friendemail;
		console.log('L29: friendEmail: ', friendEmail);

		// take 2 emails and generate from_friend ID and to_friend ID
		var from_friend_id;
		var to_friend_id; 
		db.select('id').from('users').where('email', userEmail)
		.then(function(userId) {
			from_friend_id = userId[0].id;
			console.log('L37: from_friend_id: ', from_friend_id);
		})
		.then(function(){
			console.log('L40');
			return db.select('id').from('users').where('email', friendEmail);
		})
		.then(function(friendId) {
			to_friend_id = friendId[0].id;
			console.log('L45: to_friend_id: ', to_friend_id);
		})
		.then(function() {
			console.log('L48: ');
			// check if the requested from_friend/to_friend combo already exists
			return db.select('from_friend', 'to_friend').from('friends')
			.where({
				'from_friend': from_friend_id,
				'to_friend': to_friend_id
			});
		})
		.then(function(comboExists) {
			console.log('L57: comboExists: ', comboExists);
			// if so, reject the repeat-request and tell user that friend already exists
			if (comboExists.length) {
				// console.error('This person is already in your friends list.');
				// return;
				next(new Error('This person is already in your friends list.'));
			// otherwise, add the friend
			} else {
				console.log('Adding Friend: ', to_friend_id);
				Friend.addFriend(from_friend_id, to_friend_id, function(err, newFriend) {
					console.log('fc-68: Friend Added: ', newFriend);
				});
				res.send({ error: false, message: 'Friend added'});
			}
		})
		.catch(function(err) {
			console.error(err);
		});
	},
	
	deleteFriend: function(req, res, next) {
		console.log('fc-88: deleteFriend...');
		var userEmail = req.headers.email;
		console.log('fc-90: userEmail: ', userEmail);
		var friendEmail = req.headers.friendemail;
		console.log('fc-92: friendEmail: ', friendEmail);	
		Friend.deleteFriend(userEmail, friendEmail, function(err, exFriend) {
		// 	if(err) {
		// 		next(new Error('Couldn\'t delete your friend'));
		// 	} else {
				console.log('fc-97: Friend deleted: ', exFriend);
		// 	}
		});
		res.send({ error: false, message: 'Friend deleted' });
	}
};