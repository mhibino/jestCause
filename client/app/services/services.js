angular.module('hang.services', [])

	.factory('Auth', function ($http, $location, $window) {
		var signin = function (user) {
			return $http({
					method: 'POST',
					url: '/api/users/signin',
					data: user
				})
				.then(function (resp) {
					return resp.data.token;
				});
		};

		var signup = function (user) {
			return $http({
					method: 'POST',
					url: '/api/users/signup',
					data: user
				})
				.then(function (resp) {
					return resp.data.token;
				});
		};

		var isAuth = function () {
			return !!$window.localStorage.getItem('com.hang');
		};

		var signout = function () {
			$window.localStorage.removeItem('com.hang');
			$location.path('/signin');
		};

		var getToken = function(cb) {
			cb($window.localStorage.getItem('com.hang'));
		};

		var fireChatLogin = function(user) {
			console.log('FIRE UID', user.id);
			return $http({
				method: 'GET',
				url: '/api/firechat',
				headers: {
					uid: user.id
				}
			})
			  .then(function(res) {
			  	console.log('FIRE RES', res.data);
			  	return res.data;
			  })
		};


		return {
			signin: signin,
			signup: signup,
			isAuth: isAuth,
			signout: signout,
			getToken: getToken,
			fireChatLogin: fireChatLogin
		};
	})

	.factory('Users', function($http, $location, $window) {
		var currentUser;

		var getUsers = function() {
			console.log('get users getting called')
			return $http({
				method: 'GET',
				url: '/api/users/'
			})
			.then(function(resp) {
				return resp.data;
			});
		};

		var updateUser = function(user) {
			return $http({
				method: 'PUT',
				url: '/api/users/',
				data: user
			})
			.then(function(resp) {
				console.log(resp, 'from updateUser');
				return resp.data
			});
		};

		var saveUser = function(user) {
			currentUser = user;
		};

		var getCurrentUser = function() {
			console.log('getcurrentuser getting called')
			return $http({
				method: 'GET',
				url: '/api/currentUser',
			})
			.then(user => {
				console.log('user: ', user);
				return user.data;
			});
		}

		return {
			getUsers,
			updateUser,
			saveUser,
			getCurrentUser
		}
	})

	.factory('Friends', function($http, $location, $window) {

		var getFriends = function(user) {
			console.log('GETTING FRIENDS', user);
			return $http({
				method: 'GET',
				url: '/api/friends',
				headers: {
					email: user.email
				}
			})
			.then(resp => {
				console.log('inside get friends ', resp);
				return resp.data;
			});
		};

		var addFriend = function(friend) {
			console.log('inside services with friend: ', friend)
			return $http({
				method: 'POST',
				url: '/api/friends',
				data: friend
			})
			.then(resp => {
				console.log(resp)
				return resp;
			});
		}

		return {
			getFriends,
			addFriend
		}
	})

	.factory('Events', function($http, $location, $window) {
		var guestList = [];

		var getEvents = function(user) {
			return $http({
				method: 'GET',
				url: '/api/events',
				headers: {
					email: user.email
				}
			})
			.then(resp => {
				console.log('inside get events ', resp);
				return resp.data;
			});
		};

		var getHostedEvents = function(user) {
			return $http({
				method: 'GET',
				url: '/api/hostedEvents',
				headers: {
					email: user.email
				}
			})
			.then(resp => resp.data)
		};

		var createEvent = function(event) {
			console.log('inside services with event: ', event)
			return $http({
				method: 'POST',
				url: '/api/events',
				data: {
					email: event.email,
					where: event.where,
					when: event.when,
					description: event.description,
					guests: event.guests
				}
			})
			.then(resp => {
				console.log(resp)
				return resp;
			});
		}

		var saveGuestList = function(guests) {
			console.log('running save guests: ', guests)
			guestList = guests;
		};

		var getGuestList = function(callback) {
			callback(guestList);
		};

		var getCurrentGuests = function(eventid) {
			return $http({
				method: 'GET',
				url: '/api/guests',
				headers: eventid
			})
		};

		var removeGuest = function(guest) {
			return $http({
				method: 'POST',
				url: '/api/guests/delete',
				data: {
					guestid: guest
				}
			})
		}
		return {
			getEvents,
			createEvent,
			getHostedEvents,
			saveGuestList,
			getGuestList,
			getCurrentGuests,
			removeGuest
		}
	})

	.factory('Current', function ($http, $location, $window) {

		var currentEvent = {};

		var saveCurrentEvent = function(current) {
			console.log('running save current: ', current);
			var split = current.where.split(' ').join('+');
			console.log('SPLIT CURRENT', split);
			// var parsed = queryString.stringify(current.where);
			// console.log('PARSED', parsed);
			current.where = split;
			currentEvent = current;
		};

		var getCurrentEvent = function(callback) {
			callback(currentEvent);
		};

		return {
			saveCurrentEvent: saveCurrentEvent,
			getCurrentEvent: getCurrentEvent
		}

	});



