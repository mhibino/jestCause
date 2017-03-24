/*jshint esversion: 6 */
var Event = require('./eventModel.js');
var email = require('emailjs');
var gmail = require('../../credentials/gmail.js');
var admin = require("firebase-admin");
var serviceAccount = require("../config/serviceAccount/serviceKey.json");

var server = email.server.connect({
	user: gmail.user,
	password: gmail.password,
	host: 'smtp.gmail.com',
	ssl: true
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hangout-app-4bd8c.firebaseio.com"
});

module.exports = {
	getEvents: function(req, res, next) {
		var userEmail = req.headers.email;
		Event.getEvents(userEmail, function(events) {
			if (events) {
				res.send(events);
			} else {
				next(new Error('no event found'));
			}
		});
	},

	getHostedEvents: function(req, res, next) {
		Event.getHostedEvents(req.headers.email, function(events) {
			if (events) {
				res.send(events);
			} else {
				next(new Error('no events found'));
			}
		});
	},

	fireChatLogin: function(req, res) {
		console.log('REQ BODY UID', req.body);
		var uid = req.body.uid;

		admin.auth().createCustomToken(uid)
		  .then(function(customToken) {
		    res.send(customToken);
		  })
		  .catch(function(error) {
		    console.error("Error creating custom token:", error);
		  });
	},

	createEvent: function(req, res, next) {
		let {where, when, description, guests, email} = req.body;
		console.log('whole request: ', req.body);
		console.log('guests: ', guests);
		console.log('here are the guests: ', guests);


		Event.createEvent(req.body, function(response) {
			if (response) {
				server.send({
					text: (`Where: ${where}, When: ${when}, Description: ${description}, Who: ${guests}`),
					from: gmail.user,
					to: guests.toString(),
					subject: 'Hang Invitation'
				}, function(err, message) {
					console.log(err || message);
				});
				res.send(response);
			}
			else {
				next(new Error('problem saving event'));
			}
		});
	}
};
