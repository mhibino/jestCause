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


		return {
			signin: signin,
			signup: signup,
			isAuth: isAuth,
			signout: signout
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

	// .factory('Friends', function($http, $location, $window) {
	// 	var friendList = [];

	// 	var getFriends = function(user) {
	// 		return $http({
	// 			method: 'GET',
	// 			url: '/api/friends',
	// 			headers: {
	// 				email: user.email
	// 			}
	// 		})
	// 		.then(resp => {
	// 			console.log('inside get friends ', resp);
	// 			return resp.data;
	// 		});
	// 	};

	// 	var addFriend = function(friend) {
	// 		console.log('inside services with friend: ', friend)
	// 		return $http({
	// 			method: 'POST',
	// 			url: '/api/friends',
	// 			data: {
	// 				email: friend.email
	// 			}
	// 		})
	// 		.then(resp => {
	// 			console.log(resp)
	// 			return resp;
	// 		});
	// 	}
	// 	}
	// 	return {
	// 		getFriends,
	// 		addFriend
	// 	}
	// })

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

		// var getGuestList = function() {
		// 	return $http({
		// 		method: 'GET',
		// 		url: '/api/guests',
		// 		headers: {
		// 			email: user.email
		// 		}
		// 	})
		// }

		var addGuest = function() {
			return $http({
				method: 'POST',
				url: '/api/guests',
				headers: {
					email: user.email
				}
			})
		}
		return {
			getEvents,
			createEvent,
			getHostedEvents,
			saveGuestList,
			getGuestList,
			addGuest
		}
	});



