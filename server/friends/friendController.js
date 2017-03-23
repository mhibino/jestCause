/*jshint esversion: 6 */
/* friendController */

var Friend = require('./friendModel');
	// FRIENDS
	// app.get('/api/friends', userController.getFriends);
	// app.post('/api/friends', userController.addFriends);
	// app.post('/api/friends/delete', userController.deleteFriends);

module.exports = {

	getFriends: function(req, res, next) {
		console.log('GETTING FRIENDS - REQ: ', req);
		var userEmail = req.headers.email;
		Friend.getFriends(userEmail, function(err, friends) {
			if(err) {
				next(new Error('Couldn\'t get your friends.'));
			} else {
				res.send(friends);
			}
		});
	},

	addFriend: function(req, res, next) {
		var userEmail = req.headers.email;
		var friendEmail = req.headers.friendEmail;
		Friend.addFriend(userEmail, friendEmail, function(err, newFriend) {
			if(err) {
				next(new Error('Couldn\'t add your friend.'));
			} else {
				res.send(newFriend);
			}
		});
	},
	
	deleteFriend: function(req, res, next) {
		var userEmail = req.headers.email;
		var friendEmail = req.headers.friendEmail;
		Friend.deleteFriend(userEmail, friendEmail, function(err, exFriend) {
			if(err) {
				next(new Error('Couldn\'t delete your friend'));
			} else {
				res.send(exFriend);
			}
		});
	}
};