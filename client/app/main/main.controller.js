'use strict';

angular.module('bikebuddyApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth) {
    $scope.awesomeThings = [];
    $scope.isLoggedIn = Auth.isLoggedIn;

    if ($scope.isLoggedIn()) {
      var user = Auth.getCurrentUser();
      $http.post('/api/users/similar', {
        home: user.home,
        work: user.work
      }).then(function(result){
        $scope.nearMe = result.data;
      });
    }

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.homeAddrOptions = null;
    $scope.homeAddrDetails = '';
    $scope.homeAddrResult = '';

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.getSimilar = function() {
      $http.post('/api/users/similar', {
        home: [$scope.home.details.geometry.location.B,
               $scope.home.details.geometry.location.k],
        work: [$scope.work.details.geometry.location.B,
               $scope.work.details.geometry.location.k]
      }).then(function(result){
        $scope.similar = result.data;
      });
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
