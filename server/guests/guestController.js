/*jshint esversion: 6 */
/* guestController */

var Guest = require('./guestModel');

	// GUESTS
	// app.get('/api/guests', userController.getGuests);
	// app.post('/api/guests', userController.addGuests);
	// app.put('/api/guests', userController.editGuests);
	// app.post('/api/guests/delete', userController.deleteGuests);

// module.exports = {

// 	getGuests: function(req, res, next){},
// 	addGuests: function(req, res, next){},
// 	editGuests: function(req, res, next){},
// 	deleteGuests: function(req, res, next){}
// };

module.exports = {
	getGuests: function(req, res, next) {
		var userEmail = req.headers.email;
		Guest.getGuests(userEmail, function(err, guests) {
			if (err) {
				next(new Error('Couldn\'t get your guests.'));
			} else {
				res.send(guests);
			}
		});
	}

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