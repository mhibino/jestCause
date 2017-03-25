var db = require('../config/config');

module.exports = {

	getGuests: function(eventId) {
		return db.select().from('user_events')
		.innerJoin('users', 'user_events.user_id', 'users.id')
		.where('event_id', eventId)
		.then(function(guests) {
			// console.log('gm-L10-guests: ', guests);
			return guests;
		})
		.catch(function(err) {
			console.error(err);
		});
	},

	addGuest: function(eventId, guestId) {
			
		return db.insert({user_id: guestId, event_id: eventId})
		.into('user_events')
		.then(function(newGuest) {
			// console.log('-----GM-L31-Guest Added: ', newGuest);
			return newGuest[0];
			// res.send({error: false, data: newGuest});
		})
		.catch(function(err) {
			console.error(err);
		});
	},

	removeGuest: function(guestId, eventId) {
		// console.log('GM-L33-Guest-ID: ', guestId, 'Event-ID: ', eventId);
		return db('user_events').where({
			'user_id': guestId,
			'event_id': eventId
		}).del()
		.then(function(count) {
			// console.log('GM-L39-count: ', count);
			return count;
		})
		.catch(function(err) {
			console.error(err);
		});
	},
	editGuestStatus: function(guestId, eventId, newStatus) {
		// return a call to db
		return db('user_events').where({ 'user_id': guestId, 'event_id': eventId })
		.update({'status': newStatus})
		.then(function(count) {
			console.log('gm-L51-Updated guest status -- count: ', count);
			// return count;
		})
		.catch(function(err) {
			console.error(err);
		});
	}
};

