
var userController = require('../users/userController.js');
var eventController = require('../events/eventController.js');
var friendController = require('../friends/friendController.js');
var guestController = require('../guests/guestController');

module.exports = function(app, express) {
	// SIGN IN
	app.post('/api/users/signin', userController.signin);
	// SIGN UP
	app.post('/api/users/signup', userController.signup);
	// GET USERS
	app.get('/api/users', userController.getUsers);
	app.put('/api/users', userController.updateUser);
	// GET EVENTS
	app.get('/api/events', eventController.getEvents);
	app.get('/api/hostedEvents', eventController.getHostedEvents);
	//
	app.post('/api/events', eventController.createEvent);
	// GET
	app.get('/api/currentUser', userController.currentUser);

	app.get('/api/firechat', eventController.fireChatLogin);

	// GUESTS
	app.get('/api/guests', guestController.getGuests);
	app.post('/api/guests', guestController.addGuest);
	app.put('/api/guests', guestController.editGuestStatus);
	app.post('/api/guests/delete', guestController.removeGuest);

	// FRIENDS
	app.get('/api/friends', friendController.getFriends);
	app.post('/api/friends', friendController.addFriend);
	app.post('/api/friends/delete', friendController.deleteFriend);
};

