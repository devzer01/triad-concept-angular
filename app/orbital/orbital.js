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

  $scope.timewatch = null;

  $scope.timetravel = function() {
      console.log('wait for portal');
      $scope.now = moment($scope.timewatch).unix();
      $scope.moveday();
  };

  let ctimer;
  $scope.runwatch = function () {
      if (angular.isDefined(ctimer)) return;
      ctimer = $interval(function () {
          if ($scope.timewatch !== null) {
              $scope.timeofday = moment($scope.timewatch).format("YYYY-MM-DD hh:mm");
          } else {
              $scope.timeofday = moment().format("YYYY-MM-DD hh:mm:ss");
          }

      }, 1000);
  };


  $scope.portal = false;
  $scope.timeofday =  moment().format("YYYY-MM-DD hh:mm:ss");
  $scope.canvas = document.getElementById('myCanvas');
  $scope.context = $scope.canvas.getContext('2d');
  $scope.draw = {x: $scope.canvas.width / 2, y: $scope.canvas.height / 2};
  $scope.sun = { mass: 15, color: 'red'};

    var distanceofl = function( point1, point2 ){
        var xs = 0;
        var ys = 0;

        xs = point2.x - point1.x;
        xs = xs * xs;

        ys = point2.y - point1.y;
        ys = ys * ys;

        return Math.sqrt( xs + ys );
    };

    let minutesPerYear = function (days) {
        return (days * 24 * 60);
    };

    $scope.travled = false;

    $scope.now = moment().unix();

    let calibrate = function(zero, year, pit) {
        let now = $scope.now / 60;
        let zeroDate = moment(zero).unix() / 60;
        console.log("now:" + now + " --- " + zeroDate);
        let diff = null;
        if (zeroDate > now) {
            diff = (zeroDate - now);
        } else {
            diff = (now - zeroDate);
        }

        return ((3.14 * 2) / year) * diff;
    };

    const DENOMINATOR = 1;

    let distance = function (distance) {
        return distance / DENOMINATOR;
    };


    var connection = function(name, distance, src, dst) {
        return {name: name, distance: distance, src: src, dst: dst};
    };

    let addconnection = function(name, distance, src, dst) {
        let con = new connection(name, distance, src, dst);
        let found = this.connectivity.find(function (v) {
            return (v.name === name)
        });
        if (!found) this.connectivity.push(con);
    };

    $scope.earth = {
        mass: 5,
        name: "earth",
        distance: [distance(147), distance(151)].reverse(),
        cbd: "2017-09-23 04:35:00",
        conyanow: calibrate("2017-09-23 04:35:00", (minutesPerYear(365))),
        color: "blue",
        move: function () {
            this.conyanow = this.conyanow + this.conayaperday;
        },
        travel: function (timestamp) {
            this.conyanow = calibrate("2017-09-23 04:35:00", (minutesPerYear(365)), timestamp)
        },
        conayaperday: (3.14 * 2) / (minutesPerYear(365)), connectivity: [],
        position: {x: null, y: null}
    };

    $scope.earth.add = addconnection.bind($scope.earth);

    $scope.venus = {
        mass: 4,
        name: "venus",
        distance: [distance(107), distance(108)].reverse(),
        cbd: "2017-07-13 15:22:00",
        conyanow: calibrate("2017-07-13 15:22:00", (minutesPerYear(224))),
        color: "yellow",
        move: function () {
            this.conyanow = this.conyanow + this.conayaperday;
        },
        travel: function (timestamp) {
            this.conyanow = calibrate("2017-07-13 15:22:00", (minutesPerYear(224)), timestamp)
        },
        conayaperday: (3.14 * 2) / (minutesPerYear(224)),  connectivity: [],
        position: {x: null, y: null}
    };

    $scope.venus.add = addconnection.bind($scope.venus);

    $scope.mercury = {
        mass: 3,
        name: "mercury",
        distance: [distance(47), distance(70)].reverse(),
        cbd: "2017-09-02 10:10:00",
        conyanow: calibrate("2017-09-02 10:10:00", minutesPerYear(87)),
        //zerotime: moment("2017-09-02 10:10:00").unix(), //"10:10 02-09-2017",
        color: "silver",
        move: function () {
            this.conyanow = this.conyanow + this.conayaperday;
        },
        travel: function (timestamp) {
            this.conyanow = calibrate("2017-09-02 10:10:00", (minutesPerYear(87)), timestamp)
        },
        conayaperday: (3.14 * 2) / minutesPerYear(87),  connectivity: [],
        position: {x: null, y: null}
    };

    $scope.mercury.add = addconnection.bind($scope.mercury);

    $scope.mars = {
        distance: [distance(206), distance(249)].reverse(),
        name: "mars",
        cbd: "2016-12-07 00:14:00",
        conyanow: function () {
            //calibrate("2016-12-07 00:14:00", minutesPerYear(686)),
            let now = $scope.now / 60;
            let zeroDate = moment("2016-12-07 00:14:00").unix() / 60;
            let diff = null;
            if (zeroDate > now) {
                diff = (zeroDate - now);
            } else {
                diff = (now - zeroDate);
            }
            return ((3.14 * 2) / minutesPerYear(686)) * -diff;
        }(),
        color: "red",
        mass: 6,
        move: function () {
            this.conyanow = 180 - this.conyanow + this.conayaperday;
        },
        travel: function (timestamp) {
            this.conyanow = calibrate("2016-12-07 00:14:00", (minutesPerYear(686)), timestamp)
        },
        conayaperday: (3.14 * 2) / minutesPerYear(686), connectivity: [],
        position: {x: null, y: null}
    };

    $scope.mars.add = addconnection.bind($scope.mars);

    $scope.jupitor = {
        mass: 11,
        name: "jupitor",
        distance: [distance(741 / 2), distance(817 / 2)].reverse(),
        cbd: "2010-10-16 12:01:00",
        conyanow: calibrate("2010-10-16 12:01:00", minutesPerYear(11 * 365)),
        color: "brown",
        move: function () {
            this.conyanow = this.conyanow + this.conayaperday;
        },
        travel: function (timestamp) {
            this.conyanow = calibrate("2010-10-16 12:01:00", (minutesPerYear(11 * 365)), timestamp)
        },
        conayaperday: (3.14 * 2) / minutesPerYear(11 * 365), connectivity: [],
        position: {x: null, y: null}
    };

    $scope.jupitor.add = addconnection.bind($scope.jupitor);

    $scope.saturn = {
        mass: 7,
        name: "saturn",
        distance: [distance(1400 / 3), distance(1500 / 3)].reverse(),
        cbd: "2025-12-04 17:01:00",
        conyanow: calibrate("2025-12-04 17:01:00", minutesPerYear(29 * 365)),
        color: "purple",
        move: function () {
            this.conyanow = this.conyanow + this.conayaperday;
        },
        travel: function (timestamp) {
            this.conyanow = calibrate("2025-12-04 17:01:00", (minutesPerYear(29 * 365)), timestamp)
        },
        conayaperday: (3.14 * 2) / minutesPerYear(29 * 365),
        position: {x: null, y: null}, connectivity: [],
        add: function(name, distance) {
            let con = new connection(name, distance);
            let found = this.connectivity.find(function (v) {
                return (v.name === name)
            });
            if (!found) this.connectivity.push(con);
        }
    };

    $scope.saturn.add = addconnection.bind($scope.saturn);

    $scope.uranus = {
        mass: 5,
        name: "uranus",
        cbd: "2011-03-18 08:22:00",
        distance: [distance(2500 / 5), distance(3000 / 5)].reverse(),
        conyanow: calibrate("2011-03-18 08:22:00", minutesPerYear(84 * 365)),
        color: "#67e5b3",
        move: function () {
            this.conyanow = this.conyanow + this.conayaperday;
        },
        travel: function (timestamp) {
            this.conyanow = calibrate("2011-03-18 08:22:00", (minutesPerYear(84 * 365)), timestamp)
        },
        conayaperday: (3.14 * 2) / minutesPerYear(84 * 365),
        position: {x: null, y: null}, connectivity: []
    };

    $scope.uranus.add = addconnection.bind($scope.uranus);


  $scope.planets = [$scope.mercury, $scope.venus, $scope.earth, $scope.mars, $scope.jupitor, $scope.saturn, $scope.uranus];
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
      context.ellipse($scope.draw.x, $scope.draw.y, orbital.distance[0], orbital.distance[1], 0, 0, 2 * Math.PI);
      context.lineWidth = 1;
      context.strokeStyle = 'black';
      context.stroke();
    };

    $scope.points = [];

    $scope.move = function (planet) {

        let xPos = $scope.draw.x - (planet.distance[0] * Math.cos(planet.conyanow));
        let yPos = $scope.draw.y + (planet.distance[1] * Math.sin(planet.conyanow));
        let context = $scope.context;
        planet.position.x = xPos;
        planet.position.y = yPos;
        context.beginPath();
        context.arc(xPos, yPos, 5, 0, 2*Math.PI, false);
        context.fillStyle = planet.color;
        context.fill();
        context.lineWidth = planet.mass;
        context.strokeStyle = planet.color;
        context.stroke();
        context.fillStyle = "#000000";
        context.fillText(planet.name, xPos, yPos + 20);

        context.beginPath();
        context.moveTo(xPos, yPos);
        context.lineWidth = 1;
        context.lineTo($scope.draw.x, $scope.draw.y);
        context.strokeStyle = '#94aeba';
        context.stroke();

        planet.move();

        return planet;
    };

    //$scope.tractions = [{name: "hello"}, {name: "fellow"}];
    let sanitizedposition = function(position) {
        if (position.x !== 0 && position.y !== 0 && position.x !== null && position.y !== null) return true;
        return false;
    };

    $scope.highlightfat = function(src, dst) {
        highlightcore(src, dst, 5, 'blue');
        $timeout(function () {
            highlightclear(src, dst);
        }, 5000);
    };

    let highlightcore = function(src, dst, size, color) {
        let context = $scope.context;
        context.beginPath();
        context.moveTo(src.position.x, src.position.y);
        context.lineTo(dst.position.x, dst.position.y);
        context.lineWidth = size;
        context.strokeStyle = color;
        context.stroke();
    };

    let highlightclear = function(src, dst) {
        highlightcore(src, dst, 5, '#eff0f1');
    };

    let highlight = function (src, dst) {
        highlightcore(src, dst, 1, 'gray')
    };

    $scope.line = function () {

        for (let i = 0; i < $scope.planets.length; i++) {
            for (let z = 1; z < $scope.planets.length; z++) {
                let src = $scope.planets[i];
                let dst = $scope.planets[z];

                if (sanitizedposition(src.position) && sanitizedposition(dst.position)) {
                    highlight(src, dst);
                    let distance = distanceofl(src.position, dst.position);
                    if (distance !== 0) src.add(dst.name, distance, src, dst);
                }
            }
        }
    };

    $scope.moveday = function () {
      $scope.context.clearRect(0, 0, 1200, 1200);
      $scope.points = []; $scope.matrix = [];
      $scope.star($scope.sun);
      for (let i = 0; i < $scope.planets.length; i++) {
          if ($scope.timewatch !== null) {
              $scope.planets[i].travel($scope.timewatch);
          }
          $scope.axis($scope.planets[i]);
          $scope.planets[i] = $scope.move($scope.planets[i]);
          $scope.line();
      }
    };

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

