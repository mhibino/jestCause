angular.module('hang.home', [])
	.controller('HomeController', function ($scope, Users, $mdPanel, $location, $mdDialog, $route, Auth, Events) {

		$scope.currentNavItem = "hang";
		$scope.getCurrentUser = Users.getCurrentUser;
		$scope.event = {};
		$scope.eventGuestList = ['GUEST', 'GUEST2', 'GUEST3'];
		$scope.eventGuests = [];

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
						$scope.hostedEvents = hostedEvents
					})
					.then(function() {
						Events.getGuestList(guests => {
							console.log('guests! ', guests)
							$scope.eventGuests = guests;
							Users.getUsers()
							.then(users => {
								users = users.filter(user => user.email !== $scope.user.email);
								$scope.users = users;
							});
						});
					});
				})
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
				Events.saveGuestList([]);
				$location.path('/events');
				Events.getGuestList(guestList => {
					$scope.eventGuests = guestList;
				});
			});
		}

		$scope.toggleHang = function () {
			$scope.user.hang = !$scope.user.hang;
			console.log($scope.user.hang)
			Users.updateUser($scope.user)
				.then(resp => console.log('updated ', resp))
		}

		$scope.toHome = function() {
			$location.path('/home');
		}

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

		$scope.eventList = function () {
			$location.path('/events');
		}

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



