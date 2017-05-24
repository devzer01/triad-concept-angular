'use strict';

angular.module('myApp.landing', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/landing', {
    templateUrl: 'landing/landing.html',
    controller: 'LandingCtrl'
  });
}])

/**
 * symbol
 * sound
 * picture
 * written
 * voice
 * character
 */


.controller('LandingCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.topic = "chemistry";

  $scope.concept = { name: "initial", type: null, description: null };

  $scope.learn = function () {
      var options = {
          url: "http://localhost/learn.php",
          params: {topic: $scope.topic},
          type: "GET"
      };
      $http(options).then(function(res) {
          $scope.concept = res.data;
      });
  };
}])

.directive('concept', function () {
  return {
      templateUrl: function (elm, attr) {
        return 'landing/concept.html';
      }
  }
});