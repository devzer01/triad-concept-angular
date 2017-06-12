'use strict';

/**
 *
 */

angular.module('myApp.pattern', ['ngRoute', 'angularjs-datetime-picker'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/orbital', {
    templateUrl: 'pattern/orbital.html',
    controller: 'PatternCtrl'
  });
}])

.controller('PatternCtrl', ['$scope', '$interval', '$timeout', function($scope, $interval, $timeout) {

    let base = 1200 / 2;

    let ptimer;
    $scope.drawSystem = function () {
        $scope.moveday();
        $scope.grahaCharaya = $scope.getRashi();
        mover();
    };


  $scope.timeofday =  moment().format("YYYY-MM-DD hh:mm:ss");
  $scope.canvas = document.getElementById('myCanvas');
  $scope.context = $scope.canvas.getContext('2d');
  $scope.draw = {x: 600, y: 600 };
  $scope.sun = { mass: 15, color: 'red'};
  $scope.grahaCharaya = "calculating....";

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

    $scope.rashi = {
        libra: [13.25,15.25],
        scorpio: [17.25,19.25] ,
        sagittarius: [19.25,21.25] ,
        capricorn: [21.25,23.25] ,
        aquarius: [23.25,1.25] ,
        pisces: [1.25,3.25] ,
        aries: [3.25,5.25] ,
        taurus: [5.25,7.25] ,
        gemini: [7.25,9.25] ,
        cancer: [9.25,11.25] ,
        leo: [11.25,13.25]};

    $scope.getRashi = function () {
        var mmt = moment();
        var midnight = mmt.clone().startOf('day');
        var diff = mmt.diff(midnight, 'minutes');
        let rashi =  Object.keys($scope.rashi).filter(function (k) {
            let  v = $scope.rashi[k];
            return ((v[0] * 60) <= diff && (v[1] * 60) >= diff);
        })[0];
        let graha = "";
        let tsEndTime = parseInt(midnight.format("X")) + ($scope.rashi[rashi][1] * 60 * 60);
        let slot = moment.unix(tsEndTime);
        let change = slot.diff(mmt, "minutes");
        return {graha: graha, rashi: rashi, change: {minutes: change, formatted: slot.format("HH:mm")}};
    };

    //$scope.planets = [$scope.mercury, $scope.venus, $scope.earth, $scope.mars,
      // $scope.jupitor, $scope.saturn, $scope.uranus];
    $scope.planets = [$scope.earth, $scope.jupitor];


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

    $scope.conctellation = ["cancer", "leo", "virgo", "libra", "scorpio", "sagitarius",
        "capricon", "aquamarius", "pisces", "aries", "taurus", "gemini"];


    $scope._drawPoints = function(distance, base, color) {
        let c = "black";
        if (color) c = color;
        let z = Math.PI * 2 / 12;
        let context = $scope.context;
        for (let i = 1; i <= 12; i++) {
            let angle = z * i;
            //angle -= z * 3; //adjust 3 points so 12 sit on top;
            let sin = Math.sin(angle - (z * 3));
            let cos = Math.cos(angle - (z * 3));
            let x1 = base.x + cos * (250+147);
            let y1 = base.y + sin * (250+147);

            context.beginPath();
            context.arc(x1, y1, 1, 0, (2 * Math.PI), false);
            context.lineWidth = 1;
            context.strokeStyle = c;
            context.stroke();

            let txtAngle = Math.PI * 2 / 24;
            angle = txtAngle * i * 2;
            sin = Math.sin(angle - (txtAngle * 6));
            cos = Math.cos(angle - (txtAngle * 6));
            let x2 = base.x + cos * 250;
            let y2 = base.y + sin * 250;

            context.fillStyle = "#000000";
            context.font = "16px Georgia";
            context.fillText($scope.conctellation[i- 1], x2 - 50, y2);
            context.stroke();

            context.beginPath();
            context.moveTo(x1, y1);
            context.lineWidth = 1;
            context.lineTo(base.x, base.y);
            context.strokeStyle = c;
            context.stroke();
        }
    };

    $scope.drawPoints = function (distance, color) {
        $scope._drawPoints(distance, $scope.getEarthXY(), color);
        //$scope._drawPoints(distance, {x: 400, y: 400}, color);
    };

    $scope.getEarthXY = function (day) {
        let planet = $scope.earth;
        let zero = moment(planet.zero);
        let now = moment(Date.now());
        if (day) now = day;
        let calibration = now.diff(zero, "days");
        if (calibration > planet.days) {
            calibration = calibration % planet.days;
        }
        let angle = (Math.PI * 2 / planet.days) * calibration;

        var x1 = base + Math.cos(angle)  * planet.distance;
        var y1 = base + Math.sin(angle)  * planet.distance;
        return {x: x1, y: y1};
    };

    $scope.drawLineToFrom = function (f, t, title) {
        let context = $scope.context;
        context.beginPath();
        context.moveTo(f.x, f.y);
        context.lineWidth = 1;
        context.lineTo(t.x, t.y);
        context.strokeStyle = "black";
        let x = (t.x + f.x) / 2;
        let y = (t.y + f.y) / 2;
        context.fillText(title, x, y);
        context.stroke();
    };

    /**
     * draws the numeric 1-12 on the outer ring
     */
    $scope.drawMarker = function () {

        let z = Math.PI * 2 / 12;
        let context = $scope.context;
        for (let i = 1; i <= 12; i++) {

            let angle = z * i;
            //angle -= z * 3; //adjust 3 points so 12 sit on top;
            let sin = Math.sin(angle - (z * 3));
            let cos = Math.cos(angle - (z * 3));
            let x1 = base + cos * 369;
            let y1 = base + sin * 369;

            context.beginPath();
            context.fillStyle = "#000000";
            context.fillText(i, x1, y1);
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
    let findTime = function(progress, days) {
        let g = gcd(days, 12);
        let ratio = Math.PI * 2 * progress / days;
        let onehour = (Math.PI * 2 / 12) * g;
        let hour = ratio * g;
        let match = [Math.floor(hour / onehour)];
        match[1] = Math.floor((hour / onehour) - match[0] + ((match[0] + 3) * 5));


        return {hour: (match[0] + 3), minutes: match[1]};
    };

    var getDistance = function (d, b) {
        return Math.sqrt(Math.pow((d.x - b.x), 2) + Math.pow((d.y - b.y), 2));
    };

    $scope.move = function (planet, day) {

        let context = $scope.context;
        let zero = moment(planet.zero);
        let now = moment(Date.now());
        if (day) now = day;
        let calibration = now.diff(zero, "days");
        if (calibration > planet.days) {
            calibration = calibration % planet.days;
        }
        let angle = (Math.PI * 2 / planet.days) * calibration;

        var x1 = base + Math.cos(angle)  * planet.distance;
        var y1 = base + Math.sin(angle)  * planet.distance;

        if (planet.name === "uranus") {
            //$scope.drawPoints(planet.distance);
        } else {
            //$scope._drawPoints(planet.distance, {x: x1, y: y1}, planet.color);
        }

        planet.timeing = findTime(calibration, planet.days);


        context.beginPath();
        context.arc(x1, y1, 5, 0, (2*Math.PI), false);
        context.fillStyle = planet.color;
        context.fill();
        context.lineWidth = planet.mass;
        context.strokeStyle = planet.color;
        context.stroke();
        context.fillStyle = "#000000";
        context.fillText(planet.name, x1, y1 + 20);

        if (planet.name != "earth") {
            let d = $scope.getEarthXY(day);
            let b = {x: x1, y: y1};
            let distance = getDistance(d, b);
            $scope.drawLineToFrom(b, d, distance.toFixed(2));
        } else {
            $scope._drawPoints(planet.distance, $scope.getEarthXY(day), 'black');
            let p = $scope.getEarthXY(day);
            context.beginPath();
            context.arc(p.x, p.y, 250-147, 0, 2 * Math.PI, true);
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();

            context.beginPath();
            context.arc(p.x, p.y, 250+147, 0, 2 * Math.PI, true);
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();

        }
        let planetPosition = {x: x1, y: y1};
        let sunPosition = {x: base, y: base};
        let distance = getDistance(planetPosition, sunPosition);
        $scope.drawLineToFrom(planetPosition, sunPosition, distance.toFixed(2));



        //we can store the angle to refer to time
        //15 degrees per day

        return planet;
    };

    $scope.day = moment();
    $scope.handler = null;

    $scope.moveday = function (day) {
      //$scope.context.clearRect(0, 0, base * 2, base * 2);
      $scope.star($scope.sun);
      for (var i = 0; i < $scope.planets.length; i++) {
          $scope.axis($scope.planets[i]);
          $scope.planets[i] = $scope.move($scope.planets[i], day);
      }
      $scope.drawMarker(); //draw the clock face
    };

    var mover = function() {
        if ($scope.handler === null) {
            $scope.handler = window.setInterval(function () {
                $scope.day = $scope.day.add(10, "days");
                $scope.moveday($scope.day);
            }, 100);
        }
    }




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

