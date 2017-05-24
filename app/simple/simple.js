'use strict';

/**
 *
 */

angular.module('myApp.simple', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/simple', {
    templateUrl: 'simple/simple.html',
    controller: 'SimpleCtrl'
  });
}])

.controller('SimpleCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.idealock = {};
  $scope.idealocks = [];

  $scope.addWord = function () {
      $scope.words.push({word: $scope.acronom.word, word_si: $scope.acronom.word_si, word_th: $scope.acronom.word_th});
  };


    $scope.idealocks = function () {
        $http.get(driver('idealock')).then(function (res) {
            $scope.idealocks = res.data;
        });
    };


    $scope.create = function () {
    $http.post('http://localhost/idealock', {method: "POST", data: $scope.entry}).then(function (e) {
        var concept_id = e.data.id;
        $http.post('http://localhost/words/' + concept_id, {method: 'POST', data: $scope.words}).then(function (e) {
          console.log('error');
        });
    });
  };

  $scope.assoc = {concept_id: null, word: null, word_si: null, word_th: null};

  $scope.sense = function () {
      $http.get(driver('sense')).then(function (res) {
        $scope.sensory = res.data;
      });
  };

  $scope.template = function () {
      $http.get(driver('template')).then(function (res) {
          $scope.templates = res.data;
      });
  };

  $scope.concept = function () {
      $http.get(driver('concept')).then(function (res) {
        console.log(res.data[0]);
          $scope.concepts = res.data;
      });
  };

  function driver(type) {
    return 'http://localhost/' + type;
  }

}]);