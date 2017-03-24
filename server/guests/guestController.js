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
	}
	// addGuest: function(req, res, next) {
	// 	var eventId = req.headers.eventid;
	// 	var guestId = req.headers.guestid;
	// 	Guest.addGuest(eventId, guestId)
	// 	.then(function(newGuest) {
	// 		res.send({ error: false, data: newGuest });
	// 	})
	// 	.catch(function(err) {
	// 		console.error(err);
	// 	});
	// }
};


// var Guest = require('./guestModel');
	// app.get('/api/guests', userController.getGuests);
	// app.post('/api/guests', userController.addGuests);
	// app.put('/api/guests', userController.editGuests);
	// app.post('/api/guests/delete', userController.deleteGuests);

// module.exports = {
	
// 	getGuests: function(req, res, next) {
// 		console.log('GC-L14-getGuests aka gG');
// 		var userEmail = req.headers.email;
// 		var eventId = req.headers.eventid;
// 		console.log('GC-L17-gG: ', 'userEmail ', userEmail, 'eventId ', eventId);
// 		Guest.getGuests(userEmail, eventId, function(err, guests) {
// 			if (err) {
// 				next(new Error('Couldn\'t get guest list.'));
// 			} else {
// 				res.send({error: false, message: 'Sending guest list', data: guests});
// 			}
// 		});
// 	},

  // signup: function (req, res, next) {
  //   var username = req.body.username;
  //   var password = req.body.password;
  //   var phone = req.body.phone;

  //   return models.users.getUser({username, password})
  //     .then(function(userMatch) {
  //         if (userMatch.length === 0) {
  //           models.users.createUser([username, password, phone], function(err, id) {
  //             if (err) {throw err}
  //               utilities.startSession(req, res, id);
  //           })
  //         }
  //         else {
  //           console.error('That username is already taken');
  //           res.status(403).send('Sorry, username is taken!');
  //         }
  //       })
  // },

	// addGuest: function(req, res, next) {
	// 	var userEmail = req.headers.email;
	// 	var eventId = req.headers.eventid;
	// 	var guestEmail = req.headers.guestemail;

	// 	Guest.addGuest(guestEmail, eventId, function(err, added) {
	// 		if(err) throw(err)
	// 		console.log('Friend added.');
	// 	});
	// 	res.send({ error: false, message: 'Guest added'});
	// }

		// filter out guest if already on a guest list
		// Guest.getGuests(userEmail, eventId, function(err, guestList) {

		// 	if (guestList && guestList.length) {
		// 		console.log('GC-L36-aG: GuestList', guestList);
		// 		// [ { name: 'test1', email: 'test1@test.com', profile_url: null } ]
		// 		var alreadyOnList = guestList.filter(function(g) {
		// 			return g.email === guestEmail;
		// 		});
		// 		// check guestList if guest already exists and if so...
		// 		if (alreadyOnList.length) {
		// 			next(new Error('This person is already a guest for this event.'));
		// 		}
		// 	}
		// 	return guestList;
		// })
	// 	.then(function(guestList){
	// 		// add guest to the user_events table for that event
	// 		Guest.addGuest(guestEmail, eventId, function(err, friendAdded) {
	// 			console.log('Guest has been added.');
	// 		});
	// 		res.send({ error: false, message: 'Guest added'});
	// 	})
	// 	.catch(function(err) {
	// 		console.error(err);
	// 	});
	// }
// };