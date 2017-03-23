angular.module('hang.home', [])
	.controller('HomeController', function ($scope, Users, $mdPanel, $location, $mdDialog, $route, Auth, Events) {

		$scope.currentNavItem = "hang";
		$scope.getCurrentUser = Users.getCurrentUser;
		$scope.event = {};
		$scope.eventGuestList = ['GUEST', 'GUEST2', 'GUEST3'];
		$scope.eventGuests = [];
		$scope.friends = [{name: 'KITTY1'},{name: 'KITTY2'},{name: 'KITTY3'}];
		Events.getGuestList(guests => $scope.guests = guests.toString());

		Users.getCurrentUser()
			.then(user => {
				console.log('get current user called!', user)
				$scope.user = user[0];
				Events.getEvents($scope.user)
				.then(events => {
					console.log('events! ', events)
					$scope.events = events;
					Events.getHostedEvents($scope.user)
					.then(hostedEvents => {
						$scope.hostedEvents = hostedEvents;
						console.log('HOSTED EVENTS', hostedEvents)
						Users.getUsers()
							.then(users => {
								users = users.filter(user => user.email !== $scope.user.email);
								$scope.users = users;
								console.log('HERE ARE USERS', users);
							});
					})
						// .then(function() {
							// Events.getCurrentGuests($scope.user)
							  // .then(guests => {
							  // 	console.log('GUESTS TO DISPLAY', guests);
							  // 	$scope.eventGuestList = guests;
							  // 	Friends.getFriends($scope.user)
							  // 	  .then(friends => {
							  // 	  	console.log('FRIENDS TO DISPLAY', friends);
							  // 	  	$scope.friendList = friends;
							  // 	  })
							  // })
						// });
					});
				});




		$scope.createEventClick = function($event) {
			Events.saveGuestList($scope.eventGuests);
			$scope.toEvent($event)
		}

		$scope.createEvent = function() {
			console.log('creating event: ', $scope.event, ' guests: ', $scope.guests)
			Events.createEvent({
				email: $scope.user.email,
				where: $scope.event.where,
				when: $scope.event.when,
				description: $scope.event.description,
				guests: $scope.guests
			})
			.then(resp => {
				console.log('created!')
				$location.path('/home');
			});
		}

		$scope.toggleHang = function () {
			$scope.user.hang = !$scope.user.hang;
			console.log($scope.user.hang)
			Users.updateUser($scope.user)
				.then(resp => console.log('updated ', resp))
		}

		// $scope.toHome = function() {
		// 	$location.path('/home');
		// }

		$scope.toEvent = function (ev) {
			$mdDialog.show({
					controller: 'HomeController',
					templateUrl: 'app/event/createEvent.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: $scope.customFullscreen
				});
		}



		$scope.showEventClick = function($event) {
			console.log('CLICKED EVENT', this);
			$scope.current = this.item;
			// console.log('PARAMS', params);
			// Events.saveCurrent($scope.current);
			console.log('CURRENT ITEM', $scope.current);
			$scope.toEventItem($event);
		}

		console.log('$scope.current', $scope.current);

		$scope.toEventItem = function (ev) {
			console.log('ev', ev);
			$mdDialog.show({
					controller: 'HomeController',
					templateUrl: 'app/event/eventItem.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: $scope.customFullscreen
				});
		}

		// $scope.eventList = function () {
		// 	$location.path('/events');
		// }

		$scope.changeUrl = function (ev) {
			var confirm = $mdDialog.prompt()
				.title('enter new profile picture url')
				.placeholder('url link')
				.ariaLabel('url link')
				.targetEvent(ev)
				.ok('Confirm')
				.cancel('Cancel');

			$mdDialog.show(confirm).then((result) => {
				Users.updateUser({
						email: $scope.user.email,
						profile_url: result
					})
					.then($route.reload())
			});
		}

		$scope.userEventAdd = function () {
			console.log('click! ', this)
			// this.item.invited = this.item.invited === undefined ? true : !this.item.invited;
			if (!$scope.userIsGuest(this.item.email)) {
				$scope.eventGuests.push(this.item.email);
				this.item.invited = true;
			} else {
				$scope.eventGuests.splice($scope.eventGuests.indexOf(this.item.email), 1)
				this.item.invited = false;
			}
			console.log($scope.eventGuests);
		};

		$scope.userIsGuest = function(guest) {
			return $scope.eventGuests.indexOf(guest) > -1;
		}

		$scope.signout = function () {
			Auth.signout();
		}

		$scope.closeDialog = function(ev) {
			$mdDialog.hide();
			console.log('guests after submit ', $scope.eventGuests)
			$scope.eventGuests = [];
		}
	})



