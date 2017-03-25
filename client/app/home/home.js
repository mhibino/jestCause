angular.module('hang.home', [])
	.controller('HomeController', function ($scope, Users, Current, Friends, $mdPanel, $location, $mdDialog, $route, Auth, Events) {

		$scope.currentNavItem = "hang";
		$scope.getCurrentUser = Users.getCurrentUser;
		$scope.event = {};
		// $scope.current = {};
		$scope.eventGuestList = [];
		$scope.eventGuests = [];

		Events.getGuestList(guests => $scope.guests = guests.data);
		console.log('SCOPE GUESTS', $scope.guests)

		Events.getStatus(status => $scope.status = status);
		console.log('STATUS', $scope.status);

		Current.getCurrentEvent(event => $scope.current = event);

		console.log('CURRENT', $scope.current);

		Users.getCurrentUser()
			.then(user => {
				// console.log('get current user called!', user)
				$scope.user = user[0];
				Events.getEvents($scope.user)
				.then(events => {
					// console.log('events! ', events)
					$scope.events = events;
					Events.getHostedEvents($scope.user)
					.then(hostedEvents => {
						$scope.hostedEvents = hostedEvents;
						// console.log('HOSTED EVENTS', hostedEvents)
						Users.getUsers()
							.then(users => {
								users = users.filter(user => user.email !== $scope.user.email);
								$scope.users = users;
								// console.log('HERE ARE USERS', users);
								Friends.getFriends($scope.user)
								  	  .then(friends => {
								  	  	// console.log('FRIENDS TO DISPLAY', friends.data);
								  	  	$scope.friends = friends.data;
								      })
							})
					})
				})
			});

		$scope.addFriend = function(friend) {
			console.log('FRIEND PASSED', friend);
			Friends.addFriend({email: $scope.user.email, friendemail: friend})
			  .then(function(friend) {
			  	location.path('/home');
			  	// console.log('FRIEND ADDED');
			  })
		}


		$scope.fireChatLogin = function() {
			// console.log('AVAILABLE FOR TOKEN', $scope.user);
			// $location.path('/firechat');

			Auth.fireChatLogin($scope.user)
			  .then(function(token) {
			  	console.log('GOT TOKEN', token);
			  	firebase.auth().signInWithCustomToken(token).catch(function(error) {
				  console.log("Error authenticating user:", error);
					});
			  })

			firebase.auth().onAuthStateChanged(function(user) {

			console.log('STATE CHANGE', user);
			if (user) {
				user.displayName = $scope.user.name;
				room = $scope.current;
				// console.log('ROOM FOR FIRE', room);
				// console.log('MOD USER', user);
		    initChat(user, room);
		  }

		});
		};



		function initChat(user, room) {

        var chatRef = firebase.database().ref("chat");

        var ui = new FirechatUI(chatRef, document.getElementById("firechat"));
        // console.log('ROOM INIT', room);

        ui.setUser($scope.user.id, $scope.user.name);

        ui._chat.getRoomList(function(rooms) {
        	console.log('ALL ROOMS', rooms);

        	for (var roomID in rooms) {
        		if (rooms[roomID].name === room.description) {
        			ui._chat.enterRoom(roomID);
        			return;
        		}
        	}
        	 ui._chat.createRoom(room.description, 'private', function(roomID) {
	        	console.log('ROOMID', roomID);
	        	ui._chat.enterRoom(roomID);
	        });
        });

      }

    $scope.fireChatLogout = function() {
    	firebase.auth().signOut().then(function() {
        location.reload();
      }).catch(function(error) {
        console.log("Error signing user out:", error);
      });
    }

    $scope.sendResponse = function(response, eventid, userid) {
    	console.log('INVITE RES', response, eventid, userid);
    	Events.sendResponse({newstatus: response, eventid: eventid, guestid: userid})
    	  .then(function(result) {
    	  	console.log('response saved', result);
    	  	var status = "";
    	  	result.data.new_status === 'NO' ? status = false : status = true;
    	  	console.log('STATUS SHIFT', status);
    	  	Events.saveStatus(status);
    	  })
    }

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
			$scope.current = this.item;
			console.log('CURRENT ITEM', $scope.current);
			Current.saveCurrentEvent(this.item);
			Events.getCurrentGuests({eventid: this.item.id})
			  .then(function(guests) {
			  	console.log('THESE GUESTS', guests);
			  	Events.saveGuestList(guests);
			  	$scope.toEventItem($event);
			  })
			  $scope.toEventItem($event);
		}

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

		$scope.uninviteGuest = function (guestid, eventid) {
			console.log('GUEST PASSED IN', guestid, eventid);
			Events.removeGuest(guestid, eventid)
			  .then(function(result) {
			  	console.log('removed guest', result);
			  })
			  .catch(function(err) {
			  	console.error(err);
			  })
		}

		$scope.userEventAdd = function () {
			console.log('click! ', this)
			// this.item.invited = this.item.invited === undefined ? true : !this.item.invited;
			if (!$scope.userIsGuest(this.friend.email)) {
				$scope.eventGuests.push(this.friend.email);
				this.friend.invited = true;
			} else {
				$scope.eventGuests.splice($scope.eventGuests.indexOf(this.friend.email), 1)
				this.friend.invited = false;
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



