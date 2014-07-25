'use strict';

angular.module('bikebuddyApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        // var neighborhood = _.find($scope.home.details.address_components, function(item) {
        //   return item.types[0] === 'neighborhood';
        // }).long_name;
        var zip = _.find($scope.home.details.address_components, function(item) {
          return item.types[0] === 'postal_code';
        }).long_name;

        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          home: [$scope.home.details.geometry.location.B,
                 $scope.home.details.geometry.location.k],
          work: [$scope.work.details.geometry.location.B,
                 $scope.work.details.geometry.location.k],
          // neighborhood: neighborhood,
          zip: zip,
          activity: $scope.activity,
          account: $scope.account
        })
        .then( function() {
          // Account created, redirect to route
          $location.path('/route');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
