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

    let base = 800 / 2;

    let ptimer;
    $scope.drawSystem = function () {
        $scope.moveday();
    };


  $scope.timeofday =  moment().format("YYYY-MM-DD hh:mm:ss");
  $scope.canvas = document.getElementById('myCanvas');
  $scope.context = $scope.canvas.getContext('2d');
  $scope.draw = {x: $scope.canvas.width / 2, y: $scope.canvas.height / 2};
  $scope.sun = { mass: 15, color: 'red'};

    /**
     * function to calibrate planet position
     * @param x
     * @param y
     * @param distance
     * @param calibdate
     * @returns {{x: *, y: *}}
     */
    var calibrate = function(x, y, distance, zero, days, specific) {
        var angel = todayAngel(zero, days, specific);
        var x1 = x + Math.cos(angel) * distance;
        var y1 = y + Math.sin(angel) * distance;
        return {x: x1, y: y1}
    };

    /**
     *
     * @param calibDate the date when planet orbits where y=0 and x is > 600
     * @param days number of days for full cycle of planet
     * @returns {number}
     */
    var todayAngel = function (zero, days, specific) {
        var a = moment(zero);
        var b = moment(Date.now());
        if (specific != null) {
            b = moment(specific);
        }
        return angelPer(days) * -1 * a.diff(b, 'days');
    };

    /**
     * returns radiant per day
     * @param days
     * @returns {number}
     */
    var angelPer = function(days) {
        return Math.PI * 2 / days;
    };

    $scope.earth = {
        mass: 5,
        name: "earth",
        distance: 147,
        init: {x: base + this.distance, y: base},
        zero: "2017-03-21",
        color: "blue",
        days: 365,
        timeing: {}
    };

    $scope.venus = {
        mass: 4,
        name: "venus",
        distance: 107,
        init: {x: base + this.distance, y: base},
        zero: "2017-03-23",
        color: "yellow",
        days: 224,
        timeing: {}
    };

    $scope.mercury = {
        mass: 3,
        name: "mercury",
        distance: 47,
        init: {x: base + this.distance, y: base},
        zero: "2017-01-14",
        color: "silver",
        days: 87,
        timeing: {}
    };

    $scope.mars = {
        mass: 6,
        distance: 190,
        name: "mars",
        init: {x: base + this.distance, y: base},
        zero: "2016-01-13",
        color: "red",
        days: 686,
        timeing: {}
    };

    $scope.jupitor = {
        mass: 11,
        name: "jupitor",
        distance: 250,
        init: {x: 850, y: 600 },
        zero: "2016-08-11",
        color: "brown",
        days: 365 * 11,
        timeing: {}
    };

    $scope.saturn = {
        mass: 7,
        name: "saturn",
        distance: 300,
        init: {x: base + this.distance, y: base},
        zero: "2010-01-25",
        color: "purple",
        days: 365 * 29,
        timeing: {}
    };

    $scope.uranus = {
        mass: 5,
        name: "uranus",
        distance: 350,
        init: {x: base + this.distance, y: base},
        zero: "1968-01-12",
        color: "#67e5b3",
        days: 84 * 365,
        timeing: {}
    };


    $scope.planets = [$scope.mercury, $scope.venus, $scope.earth, $scope.mars,
      $scope.jupitor, $scope.saturn, $scope.uranus];


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
      context.arc($scope.draw.x, $scope.draw.y, orbital.distance, 0, 2 * Math.PI, true);
      context.lineWidth = 1;
      context.strokeStyle = 'black';
      context.stroke();
    };

    $scope.sin = [];
    $scope.cos = [];
    $scope.angle = [];
    $scope.pointx = [];
    $scope.pointy = [];

    $scope.drawPoints = function (distance) {

        let z = Math.PI * 2 / 12;
        let context = $scope.context;
        for (let i = 1; i <= 12; i++) {

            let angle = z * i;
               //angle -= z * 3; //adjust 3 points so 12 sit on top;
            let sin = Math.sin(angle - (z * 3));
            let cos = Math.cos(angle - (z * 3));
            let x1 = base + cos * distance;
            let y1 = base + sin * distance;

            $scope.sin.push(sin);
            $scope.cos.push(cos);
            $scope.angle.push(angle);
            $scope.pointx.push(x1);
            $scope.pointy.push(y1);

            context.beginPath();
            context.arc(x1, y1, 5, 0, (2 * Math.PI), false);
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();
            context.fillStyle = "#000000";
            context.fillText(i, x1, y1 + 20);
            context.stroke();
        }
    };

    var gcd = function(a, b) {
        if ( ! b) {
            return a;
        }

        return gcd(b, a % b);
    };

    /**
     * we just simplify the calculation by using gcd.
     * took me almost 24 hours to realize it. but was fun going back to the childhood
     * @param progress
     * @param days
     * @returns {*}
     */
    let findHour = function(progress, days) {
        let g = gcd(days, 12);
        let ratio = Math.PI * 2 * progress / days;
        let onehour = (Math.PI * 2 / 12) * g;
        let hour = ratio * g;
        let match = [hour / onehour ];
/*        for (var i = 1; i < $scope.angle; i++) {
            if ($scope.angle[i] > hour && $scope.angle[i] < hour) {
                match.push(i);
            }
        }*/
        console.log(match);
        return match[0];
    };

    $scope.move = function (planet) {

        let context = $scope.context;
        let zero = moment(planet.zero);
        let now = moment(Date.now());
        let calibration = now.diff(zero, "days");
        if (calibration > planet.days) {
            calibration = calibration % planet.days;
        }
        let angle = (Math.PI * 2 / planet.days) * calibration;

        var x1 = base + Math.cos(angle) * planet.distance;
        var y1 = base + Math.sin(angle) * planet.distance;

        $scope.drawPoints(planet.distance);
        console.log("Calibration::::" + calibration + ", Days:::::" +  planet.days + " --- " + (calibration / planet.days));
        planet.timeing.hour = findHour(calibration, planet.days);


        context.beginPath();
        context.arc(x1, y1, 5, 0, (2*Math.PI), false);
        context.fillStyle = planet.color;
        context.fill();
        context.lineWidth = planet.mass;
        context.strokeStyle = planet.color;
        context.stroke();
        context.fillStyle = "#000000";
        context.fillText(planet.name, x1, y1 + 20);


        context.beginPath();
        context.moveTo(x1, y1);
        context.lineWidth = 1;
        context.lineTo($scope.draw.x, $scope.draw.y);
        context.strokeStyle = '#94aeba';
        context.stroke();

        //we can store the angle to refer to time
        //15 degrees per day

        return planet;
    };


    $scope.moveday = function () {
      $scope.context.clearRect(0, 0, base * 2, base * 2);
      $scope.star($scope.sun);
      for (var i = 0; i < $scope.planets.length; i++) {
          $scope.axis($scope.planets[i]);
          $scope.planets[i] = $scope.move($scope.planets[i]);
      }
    };

}]);

function Planet(options) {
    this.color = options.color;
    this.mass = options.mass;
    this.name = options.name;
    this.context = options.context;
}

Planet.prototype.draw = function (x1, y1) {

    context.beginPath();
    context.arc(x1, y1, 5, 0, (2*Math.PI), false);
    context.fillStyle = planet.color;
    context.fill();
    context.lineWidth = planet.mass;
    context.strokeStyle = planet.color;
    context.stroke();
    context.fillStyle = "#000000";
    context.fillText(planet.name, x1, y1 + 20);
};

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

