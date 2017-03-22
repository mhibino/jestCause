var userController = require('../users/userController.js');
var eventController = require('../events/eventController.js');

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

	// GUESTS
	// app.get('/api/guests', userController.getGuests);
	// app.post('/api/guests', userController.addGuests);
	// app.put('/api/guests', userController.editGuests);
	// app.post('/api/guests/delete', userController.deleteGuests);

	// FRIENDS
	// app.get('/api/friends', userController.getFriends);
	// app.post('/api/friends', userController.addFriends);
	// app.post('/api/friends/delete', userController.deleteFriends);
};

