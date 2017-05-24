'use strict';

/**
 * 7783786477
 */

angular.module('myApp.office', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/office', {
    templateUrl: 'office/office.html',
    controller: 'AdminCtrl'
  });
}])

.controller('AdminCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.concepts = {};
  $scope.senses = [];
  $scope.templates = [];

  $scope.words = [];

  $scope.acronom = {};

  $scope.entry = { description: null, description_si : null, description_th: null, name: null, name_si: null, name_th: null, parent_id: 0, template_id: null };

  $scope.addWord = function () {
      $scope.words.push({word: $scope.acronom.word, word_si: $scope.acronom.word_si, word_th: $scope.acronom.word_th});
  };

  $scope.create = function () {
    $http.post('http://localhost/concept', {method: "POST", data: $scope.entry}).then(function (e) {
        var concept_id = e.data.id;
        $http.post('http://localhost/words/' + concept_id, {method: 'POST', data: $scope.words}).then(function (e) {
          console.log('error');
        });
    });
  };

  $scope.assoc = {concept_id: null, word: null, word_si: null, word_th: null};

  $scope.reffer = function () {
      var word = {word: $scope.assoc.word, word_si: $scope.assoc.word_si, word_th: $scope.assoc.word_th};
      $http.post('http://localhost/words/' + $scope.assoc.concept_id, {method: 'POST', data: [word]}).then(function (e) {
          console.log('error');
      });
  };

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