/*jshint esversion: 6 */
/* guestController */
var Guest = require('./guestModel');

module.exports = {

	getGuests: function(req, res, next) {
		var eventId = req.headers.eventid;
		console.log('eventId: ', eventId);
		Guest.getGuests(eventId)
		.then(function(guests) {
			res.send(guests);
		})
		.catch(function(err) {
			console.error(err);
		});
	},

	addGuest: function(req, res, next) {
		var eventId = req.headers.eventid;
		var guestId = req.headers.guestid;
		// console.log('gc-L22-eventId ', eventId, 'guestId ', guestId);
		return Guest.getGuests(eventId)
		.then(function(guests) {
			// console.log('gc-L25-guests: ', guests);
			return guests.filter(function(guest) {
				// console.log('guest.user_id: ', typeof guest.user_id);
				// console.log('guestId: ', Number(guestId));
				return guest.user_id === Number(guestId);
			});
		})
		.then(function(filteredGuests) {
			// console.log('gc-L33-filteredGuests: ', filteredGuests);
			if (filteredGuests.length > 0) {
				// console.error('That person is already a guest');
				res.status(403).send('That person is already a guest');
			} else {
				return Guest.addGuest(eventId, guestId)
				.then(function(newGuest) {
					// console.log('>>>>>>>GC-L42-newGuest: ', newGuest);
					res.send({ error: false, message: 'New guest added.' });
				})
				.catch(function(err) {
					console.error(err);
				});
			}
		});
	},

	removeGuest: function(req, res, next) {
		// console.log('REQ BODY', req.body);
		var guestId = req.body.guestid;
		var eventId = req.body.eventid;
		// console.log('GC-L55-Guest-ID: ', guestId, 'Event-ID: ', eventId);
		return Guest.removeGuest(guestId, eventId)
		.then(function(removedCount) {
			// console.log('GC-L59-removed-count: ', removedCount);
			res.send({ message: 'Guests removed: ', removedCount});
		});

	},

	editGuestStatus: function(req, res, next) {
		console.log('gc-L62: editGuestStatus request received.');
		var guestId = req.headers.guestid;
		var eventId = req.headers.eventid;
		var newStatus = req.headers.newstatus;
		// invoke method in model, passing in guestId, eventId, new status
		return Guest.editGuestStatus(guestId, eventId, newStatus)
		.then(function(err, count) {
			if (err) {
				console.error(err);
			} else {
				console.log('Guest status updated');
				res.send({ error: false, message: 'Guest status updated', new_status: newStatus });
			}
		})
		.catch(function(err) {
			console.error(err);
		});
	}


};

