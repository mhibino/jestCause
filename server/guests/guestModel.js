var db = require('../config/config');

module.exports = {

	getGuests: function(eventId) {
		return db.select().from('user_events')
		.innerJoin('users', 'user_events.user_id', 'users.id')
		.where('event_id', eventId)
		.then(function(guests) {
			console.log('gm-L10-guests: ', guests);
			return guests;
		})
		.catch(function(err) {
			console.error(err);
		});
	}
};

// module.exports = {

// 	getGuests: function(eventId) {
// 		console.log('GM-L6-getGuests aka gG: ', 'eventId ', eventId);
// 		return db.select('users.name', 'users.email', 'users.profile_url').from('user_events')
// 		// .innerJoin('users', 'user_events.user_id', 'users.id')
// 		.innerJoin('events', 'user_events.event_id', 'events.id')
// 		.where('event_id', eventId)
// 			// 'host_id': (db.select('id').from('users').where('email', userEmail)) 
// 		// })
// 		.then(function(guests) {
// 			console.log('These are the guests', guests);
// 			return guests;
// 			// cb(null, guests);
// 		})
// 		.catch(function(err) {
// 			console.error(err);
// 		});
// 	}

	// addGuest: function(guestEmail, eventId, cb) {
	// 	db('user_events').insert({
	// 		user_id: (db.select('id').from('users').where('email', guestEmail)),
	// 		event_id: eventId
	// 	})
	// 	.then(function(newGuest) {
	// 		console.log('GM-L28: newGuest: ', newGuest);
	// 		cb(null, newGuest);
	// 	})
	// 	.catch(function(err) {
	// 		cb(err);
	// 	});
	// }
// };

// getAttendees: function(eventID, callback) {
// 		db.select().from('user_events').innerJoin('users', 'user_events.user_id', 'users.id').where('event_id', eventID)
// 		.then(function(userID){
// 			console.log("This is what is returned from inner join table call ", userID)
// 			callback(userID);
// 		})
// 	},