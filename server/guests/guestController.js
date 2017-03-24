/*jshint esversion: 6 */
/* guestController */

var Guest = require('./guestModel');

	// app.get('/api/guests', userController.getGuests);
	// app.post('/api/guests', userController.addGuests);
	// app.put('/api/guests', userController.editGuests);
	// app.post('/api/guests/delete', userController.deleteGuests);

module.exports = {
	
	getGuests: function(req, res, next) {
		console.log('GC-L14-getGuests aka gG');
		var userEmail = req.headers.email;
		var eventId = req.headers.eventid;
		console.log('GC-L17-gG: ', 'userEmail ', userEmail, 'eventId ', eventId);
		Guest.getGuests(userEmail, eventId, function(err, guests) {
			if (err) {
				next(new Error('Couldn\'t get guest list.'));
			} else {
				res.send({error: false, message: 'Sending guest list', data: guests});
			}
		});
	},

	// addGuest: function(req, res, next) {
	// 	var userEmail = req.headers.email;
	// 	Guest.addGuest(userEmail, guestEmail, function(err, newGuest) {
	// 		if (err) {
	// 			next(new Error('Couldn\'t add your guest.'));
	// 		} else {
	// 			res.send(guest);
	// 		}
	// 	});
	// }
};