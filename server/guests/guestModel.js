var db = require('../config/config');

module.exports = {

	getGuests: function(userEmail, eventId, cb) {
		console.log('GM-L6-getGuests aka gG: ', 'userEmail ', userEmail, 'eventId ', eventId);
		db.select('users.name', 'users.email', 'users.profile_url').from('user_events')
		.innerJoin('users', 'user_events.user_id', 'users.id')
		.innerJoin('events', 'user_events.event_id', 'events.id')
		.where({
			'event_id': eventId,
			'host_id': (db.select('id').from('users').where('email', userEmail)) 
		})
		.then(function(guests) {
			console.log('These are the guests', guests);
			cb(null, guests);
		})
		.catch(function(err) {
			cb(err);
		});
	}

};

// getAttendees: function(eventID, callback) {
// 		db.select().from('user_events').innerJoin('users', 'user_events.user_id', 'users.id').where('event_id', eventID)
// 		.then(function(userID){
// 			console.log("This is what is returned from inner join table call ", userID)
// 			callback(userID);
// 		})
// 	},