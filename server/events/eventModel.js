/*jshint esversion: 6 */
var db = require('../config/config.js');

module.exports = {
	getEvents: function(userEmail, callback) {
		// RAW SQL
		// select * from events inner join user_events on events.id=user_events.event_id inner join users on user_events.user_id=users.id where users.email=userEmail
		// KNEX
		db.select().from('events')
		.innerJoin('user_events', 'events.id', 'user_events.event_id')
		.innerJoin('users', 'user_events.user_id', 'users.id')
		.where('users.email', userEmail)

		// // THEIR CODE
		// RAW SQL
		// select * from events inner join user_events on events.id=user_events.event_id inner join users on users.id=events.host_id where users.email=
		// KNEX
		// db.select().from('events')
		// .innerJoin('user_events', 'events.id', 'user_events.event_id')
		// .innerJoin('users', 'users.id', 'events.host_id') // <=ISN'T THAT HOSTED EVENTS???
		// .where('user_events.user_id',
		// 	db.select('id').from('users')
		// 	.where('email', userEmail))

		.then(function(events) {
			callback(events);
		})
		.catch(err => console.error(err));
	},

	// query db for list of events a specific user is hosting
	getHostedEvents: function(userEmail, callback) {
		// RAW SQL
		// select * from events e inner join users u on e.host_id=u.id where u.email=user
		// KNEX
		db.select().from('events')
		.innerJoin('users', 'events.host_id', 'users.id')
		.where('email', userEmail)
		// // THEIR CODE
		// db.from('events').where('host_id',
		// 	db.select('id').from('users').where('email', userEmail)
		// 	)
		.then(function(events) {
			callback(events);
		}).catch(function(err) {
			console.error(err);
		});
	},

	createEvent: function(event, callback) {
		console.log('inside the model with this event: ', event);
		db.select('id').from('users').where('email', event.email)
		.then(function(host_id) {
			db('events').insert({
				where: event.where,
				when: event.when,
				description: event.description,
				host_id: (db.select('id').from('users').where('email', event.email))
			})
			.then(function(inserted) {
				event.guests.split(',').forEach(guest => {
					db('user_events').insert({
						user_id: (db.select('id').from('users').where('email', guest)),
						event_id: inserted[0]
					}).then(function(insertedUserEvents) {
						console.log('inserted user_event');
					});
				});
				callback(inserted);
			}).catch(function(err) {
				console.error(err);
			});
		});
	}
};

