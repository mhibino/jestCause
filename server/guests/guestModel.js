var db = require('../config/config');

module.exports = {

	getGuests: function(eventID, cb) {
		db.select().from('user_events')
		.innerJoin('users', 'user_events.user_id', 'users.id').where('.event_id', eventID)
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