'use strict';

/**
 *
 */

angular.module('myApp.orbital', ['ngRoute', 'angularjs-datetime-picker'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/orbital', {
    templateUrl: 'orbital/orbital.html',
    controller: 'OrbitalCtrl'
  });
}])

.controller('OrbitalCtrl', ['$scope', '$interval', '$timeout', function($scope, $interval, $timeout) {

  let ptimer;
  $scope.drawSystem = function () {
      if (angular.isDefined(ptimer)) return;
      $scope.moveday();
      ptimer = $interval($scope.moveday, 1000 * 60);
  };

  $scope.timewatch;

  /*scope.$watch($scope.timewatch, function (newval, oldval) {
      console.log(oldval);
        if (newval !== oldval) {
            return travelintime(moment($scope.timewatch).unix());
        }
  });*/

  $scope.travelintime = function() {
        console.log('wait for portal');
        $scope.portal = true;
        $scope.moveday();
        //console.log(moment($scope.timewatch).unix());
  };



  $scope.portal = false;
  $scope.timeofday =  moment().format("YYYY-MM-DD hh:mm:ss");
  $scope.canvas = document.getElementById('myCanvas');
  $scope.context = $scope.canvas.getContext('2d');
  $scope.draw = {x: $scope.canvas.width / 2, y: $scope.canvas.height / 2};
  $scope.sun = { mass: 15, color: 'red'};


    const DENOMINATOR = 1;

    let distance = function (distance) {
        return distance / DENOMINATOR;
    };


    var calibrate = function(x, y, distance, angel) {
        var x1 = x + Math.cos(angel) * distance;
        var y1 = y + Math.sin(angel) * distance;
        return {x: x1, y: y1}
    };

    var todayAngel = function () {
        var a = moment("2017-03-21");
        var b = moment(Date.now());
        console.log(b.diff(a, "days"));
        return angelPer * -1 * a.diff(b, 'days');
    };

    var angelPer = 3.14 / 2 / 365;

    $scope.earth = {
        mass: 5,
        name: "earth",
        distance: distance(147),
        calibration: "2017-03-21 00:00:00",
        conyanow: calibrate(600, 600, 147, todayAngel()), //this calculation is for 0 day at y == 0 and x = 147
        color: "blue",
        move: function () {
            this.conyanow = this.conyanow - todayAngel();
        },
        conayaperday: angelPer, connectivity: [],
        position: {x: null, y: null}
    };

    $scope.planets = [$scope.earth];
    $scope.matrix = [
      { planet: null, connections: [
          {planet: null }
      ] }
  ];


    $scope.star = function (star) {
        var context = $scope.context;
        context.beginPath();
        context.arc($scope.draw.x, $scope.draw.y, star.mass, 0, Math.PI * 2, false);
        context.fillStyle = star.color;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = star.color;
        context.stroke();
    };

    $scope.axis = function(orbital) {
      var context = $scope.context;
      context.beginPath();
      context.arc($scope.draw.x, $scope.draw.y, orbital.distance[0], 0, 2 * Math.PI, true);
      context.lineWidth = 1;
      context.strokeStyle = 'black';
      context.stroke();
    };

    $scope.points = [];

    $scope.move = function (planet) {

        var cordinates = planet.conyanow;
        let context = $scope.context;
        planet.position.x = cordinates.x;
        planet.position.y = cordinates.y;
        context.beginPath();
        context.arc(750, 600, 5, 0, 2*Math.PI, false);
        context.fillStyle = planet.color;
        context.fill();
        context.lineWidth = planet.mass;
        context.strokeStyle = planet.color;
        context.stroke();
        context.fillStyle = "#000000";
        context.fillText(planet.name, cordinates.x, cordinates.y + 20);

        var x1 = 600 + Math.cos(2 * Math.PI / 365);
        var y1 = 750 + Math.sin(2 * Math.PI / 365);

        context.beginPath();
        context.arc(x1, y1, 5, 0, (2*Math.PI), false);
        context.fillStyle = planet.color;
        context.fill();
        context.lineWidth = planet.mass;
        context.strokeStyle = planet.color;
        context.stroke();
        context.fillStyle = "#000000";


        context.beginPath();
        context.moveTo(cordinates.x, cordinates.y);
        context.lineWidth = 1;
        context.lineTo($scope.draw.x, $scope.draw.y);
        context.strokeStyle = '#94aeba';
        context.stroke();

        planet.move();

        return planet;
    };


    $scope.moveday = function () {
      $scope.context.clearRect(0, 0, 1200, 1200);
      $scope.points = []; $scope.matrix = [];
      $scope.star($scope.sun);
      for (var i = 0; i < $scope.planets.length; i++) {
          $scope.axis($scope.planets[i]);
          $scope.planets[i] = $scope.move($scope.planets[i]);
          //$scope.line();
      }
    };

}]);

function planet() {

}

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

