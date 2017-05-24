'use strict';

/**
 *
 */

angular.module('myApp.orbital', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/orbital', {
    templateUrl: 'orbital/orbital.html',
    controller: 'OrbitalCtrl'
  });
}])

.controller('OrbitalCtrl', ['$scope', '$interval',  function($scope, $interval) {

  $scope.earth = {
      day: (24 * 60 * 60),
      year: 365.26 * this.day,
      dypath: 0,
      lengthbased: getSphere(152, 147),
      conayaperday: (3.14 * 2) / 365,
      mass: null,
      distance: [147, 151],
      min: getDayOfYear(0, 2),
      max: getDayOfYear(6, 3),
      conyanow: 0,
      conyatomorrow: function () {
          return this.conyanow + this.conayaperday
      },
      move: function () {
          this.conyanow = this.conyanow + this.conayaperday;
      }
  };

  $scope.drawSystem = function () {
      $interval($scope.moveday, 1000, 0, null, null);
  };

  $scope.sun = function () {
      var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');
      var centerX = canvas.width / 2;
      var centerY = canvas.height / 2;
      var radius = 5;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
      context.fillStyle = 'red';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = 'red';
      context.stroke();
  };

  $scope.axis = function() {
      var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');
      var centerX = canvas.width / 2;
      var centerY = canvas.height / 2;
      var radius_min = 147;
      var radium_max = 30;
      context.beginPath();
      context.ellipse(centerX, centerY, $scope.earth.distance[0], $scope.earth.distance[1], 0, 0, 2 * Math.PI);
      //context.fillStyle = 'black';
      //context.fill();
      context.lineWidth = 1;
      context.strokeStyle = 'black';
      context.stroke();
  };
    //36 = 5
  //152 = 21
  //147 = 20

    $scope.movedaycircle = function () {
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');
        var centerX =  canvas.width / 2;
        var centerY =  canvas.height / 2;
        var xPos = centerX - ($scope.earth.distance[0] * Math.cos($scope.earth.conyanow));
        var yPos = centerY + ($scope.earth.distance[1] * Math.sin($scope.earth.conyanow));
        context.beginPath();
        context.arc(xPos, yPos, 5, 0, 2*Math.PI, false);
        context.fillStyle ="blue";
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = 'blue';
        context.stroke();
        $scope.earth.move();
    }

      $scope.moveday = function () {
          var canvas = document.getElementById('myCanvas');
          var context = canvas.getContext('2d');
          var centerX = canvas.width / 2;
          var centerY = canvas.height / 2;
          var radius_min = 20;
          var radium_max = 21;
          context.clearRect(0, 0, 600, 600);
          $scope.sun();
          $scope.axis();
          $scope.movedaycircle();
          $scope.earth.move();
          //context.beginPath();
          //context.ellipse(centerX, centerY, $scope.earth.distance[0], $scope.earth.distance[1], 0, $scope.earth.conyanow, $scope.earth.conyatomorrow());
          //context.arc(centerX, centerY, radius, $scope.earth.conyanow, $scope.earth.conyatomorrow(), false);
          //context.lineWidth = 10;
          //context.strokeStyle = '#003300';
          //context.stroke();

      }

}]);

var getSphere = function (a, b) {
  var a2 = Math.pow(a, a);
  var b2 = Math.pow(b, b);
  return Math.sqrt((a2 + b2) / 2);
};

var getDayOfYear = function (month, day) {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
};