angular.module('hang.event', [])

  .controller('EventController', function ($scope, $window, $location, $http, Auth, Current, Users, Events) {

    Events.getGuestList(guests => $scope.guests = guests.toString());

    Current.getCurrentEvent(event => $scope.current = event);

    Users.getCurrentUser()
      .then(user => {
        console.log('get current user called!', user)
        $scope.user = user[0];
      })

    $scope.fireChatLogin = function() {
      console.log('AVAILABLE FOR TOKEN', $scope.user);

      Auth.fireChatLogin($scope.user)
        .then(function(token) {
          console.log('GOT TOKEN', token);
          firebase.auth().signInWithCustomToken(token).catch(function(error) {
          console.log("Error authenticating user:", error);
          });
        })
    };

    firebase.auth().onAuthStateChanged(function(user) {

      console.log('STATE CHANGE', user);
      if (user) {
        user.displayName = $scope.user.name;
        room = $scope.current.description;
        console.log('ROOM FOR FIRE', room);
        console.log('MOD USER', user);
        initChat(user, room);
      }
    });

    function initChat(user, room) {

        var chatRef = firebase.database().ref("chat");

        var chat = new FirechatUI(chatRef, document.getElementById("firechat"));
        console.log('ROOM INIT', room);
        chat.setUser($scope.user.id, $scope.user.name);
      }

    $scope.fireChatLogout = function() {

    }


  });