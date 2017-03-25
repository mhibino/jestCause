angular.module('hang', [
	'hang.auth',
	'hang.home',
	'hang.services',
	'ngMaterial',
	'ngRoute'
])
.config(function($routeProvider, $httpProvider, $locationProvider){
	$routeProvider
		.when('/signin', {
			templateUrl: 'app/auth/signin.html',
			controller: 'AuthController'
		})
		.when('/signup', {
			templateUrl: 'app/auth/signup.html',
			controller: 'AuthController'
		})
		.when('/home', {
			templateUrl: 'app/home/home.html',
			controller: 'HomeController'
		})
    .when('/firechat', {
      templateUrl: 'app/event/firechat.html',
      controller: 'HomeController'
    })
		.when('/createEvent', {
			templateUrl: 'app/event/createEvent.html',
			controller: 'HomeController'
		})
		.otherwise({
			redirectTo: '/home'
		});

		$locationProvider.hashPrefix('');
		$httpProvider.interceptors.push('AttachTokens');
	})


	.factory('AttachTokens', function ($window) {
		var attach = {
			request: function (object) {
				var jwt = $window.localStorage.getItem('com.hang');
				if (jwt) {
					object.headers['x-access-token'] = jwt;
				}
				object.headers['Allow-Control-Allow-Origin'] = '*';
				return object;
			}
		};
		return attach;
	})
	.run(function ($rootScope, $location, Auth) {
		$rootScope.$on('$routeChangeStart', function (evt, next, current) {
			if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
				$location.path('/signin');
			}
		});

	});

			// firebase.auth().onAuthStateChanged(function(user) {
   //      // Once authenticated, instantiate Firechat with the logged in user
   //      if (user) {
   //        initChat(user);
   //      }
   //    });




      // function initChat(user) {
      //   // Get a Firebase Database ref
      //   var chatRef = firebase.database().ref("chat");

      //   // Create a Firechat instance
      //   var chat = new FirechatUI(chatRef, document.getElementById("firechat"));

      //   // Set the Firechat user
      //   chat.setUser(user.uid, user.displayName);
      // }