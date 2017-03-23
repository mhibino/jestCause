var db = require('../config/config');

module.exports = {

	getFriends: function(userEmail, cb) { 
		db.select('users.name', 'users.email').from('friends')
		.innerJoin('users', 'friends.to_friend', 'users.id')
		.where('friends.from_friend', 
			db.select('id').from('users').where('email', userEmail))
		.then(function(friends) {
			cb(null, friends);
		})
		.catch(function(err) {
			cb(err);
		});
	},

	addFriend: function(userId, friendId, cb){
		// console.log('FRIEND_MODEL | ', 'userEmail: ', userEmail, 'friendEmail: ', friendEmail);
		db('friends').insert({
			from_friend: userId,
			// (db.select('id').from('users').where('email', userEmail)),
			to_friend: friendId
			// (db.select('id').from('users').where('email', friendEmail))
		}).then(function(newFriend) {
			console.log('fm-26: newFriend: ', newFriend[0]);
			cb(null, newFriend[0]);
		})
		.catch(function(err) {
			cb(err);
		});
	},

	deleteFriend: function(userEmail, friendEmail, cb) {
		db('friends').where({
			'from_friend': (db.select('id').from('users').where('email', userEmail)),
			'to_friend': (db.select('id').from('users').where('email', friendEmail))
		}).del()
		.then(function(exFriend) {
			console.log('fm-40: from_friend: ', userEmail, 'exFriend: ', exFriend);
			cb(null, exFriend);
		})
		.catch(function(err) {
			cb(err);
		});
	}

};