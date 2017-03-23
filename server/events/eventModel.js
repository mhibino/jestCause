var db = require('../config/config.js');

module.exports = {
	getEvents: function(user, callback) {
		db.select().from('events').innerJoin('user_events', 'events.id', 'user_events.event_id').innerJoin('users', 'users.id', 'events.host_id')
		.where('user_events.user_id', db.select('id').from('users').where('email', user))
		.then(function(events) {
			callback(events);
		}).catch(err => console.error(err));

	},

	getHostedEvents: function(user, callback) {
		db.from('events').where('host_id', db.select('id').from('users').where('email', user))
		.then(function(events) {
			callback(events)
		}).catch(function(err) {
			console.error(err);
		})
	},

	createEvent: function(event, callback) {
		console.log('inside the model with this event: ', event)
		db.select('id').from('users').where('email', event.email)
		.then(function(host_id) {
			db('events').insert({
				where: event.where,
				when: event.when,
				description: event.description,
				host_id: (db.select('id').from('users').where('email', event.email))
			}).then(function(inserted) {
				event.guests.split(',').forEach(guest => {
					db('user_events').insert({
						user_id: (db.select('id').from('users').where('email', guest)),
						event_id: inserted[0]
					}).then(function(insertedUserEvents) {
						console.log('inserted user_event');
					})
				})
				callback(inserted)
			}).catch(function(err) {
				console.error(err);
			})
		});
	}
}

