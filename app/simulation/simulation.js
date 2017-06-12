angular.module('myApp.simulation', ['ngRoute', 'angularjs-datetime-picker'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/simulation', {
    templateUrl: 'simulation/simulation.html',
    controller: 'SimulationCtrl'
  });
}])

.controller('SimulationCtrl', ['$scope', '$interval', '$timeout', function($scope, $interval, $timeout) {

    let base = 800 / 2;

    $scope.canvas = document.getElementById('myCanvas');
    $scope.context = $scope.canvas.getContext('2d');
    $scope.paintBrush = new PaintBrush($scope.context);
    $scope.oscillator = new Oscillator(base);

    $scope.mercury = {
        mass: 3,
        name: "mercury",
        distance: 47,
        init: {x: base + this.distance, y: base},
        zero: "2017-01-14",
        color: "yellow",
        days: 87,
        oscillator: new Oscillator(base, 47, 87, "2017-01-14")
    };

    $scope.learn = {
        mass: 3,
        name: "alpha",
        distance: 100,
        init: {x: base + this.distance, y: base},
        zero: "2017-01-14",
        color: "silver",
        days: 60,
        oscillator: new Oscillator(base, 100, 60, "2017-01-14")
    };

    var drawSectorBorder = function () {
        $scope.paintBrush.drawArc(base, base, "red", "sun", 15);
        for (let i = 1; i <= 12; i++) {
            let rad = Math.PI * 2 / 12 * i;
            let x = base + Math.cos(rad) * $scope.learn.distance;
            let y = base + Math.sin(rad) * $scope.learn.distance;
            let z = base + Math.cos(rad) * $scope.learn.distance;
            $scope.paintBrush.drawLineToCenter(x, y, z.toFixed(4));
        }
    };

    var drawPlanet = function(planet, day) {
        $scope.paintBrush.axis(planet);
        let est = planet.oscillator.estimate(day); //, planet.zero, planet.days, planet.distance);
        $scope.paintBrush.drawArc(est.x, est.y, planet.color, planet.name, planet.width);
        if (planet.name == "alpha") $scope.points.push({cos: planet.oscillator.cos, sin: planet.oscillator.sin, tan: planet.oscillator.tan});
        return planet;
    };

    var scence = function(planet, current) {
        $scope.$apply( function () {
            planet = drawPlanet(planet, current);
        });

    };

    $scope.points = [
        {sin: 0, cos: 0, tan: 0}
    ];

    var animate = function(start, end) {
        let current = moment(start).format('x');
        var timer = window.setInterval(function () {
            let next = moment(current, "x").add('days', 1).format('x');
            $scope.paintBrush.clear();
            drawSectorBorder();
            scence($scope.mercury, current);
            scence($scope.learn, current);
            current = next;
            if (next > moment(end).format('x')) {
                clearInterval(timer);
            }
        }, 1000);
    };

    $scope.init = function () {
        drawSectorBorder();
        drawPlanet($scope.mercury);
        drawPlanet($scope.learn);
        //animate("2017-01-12", "2017-03-31");
    };

    $scope.planets = [$scope.mercury];




}]);

var drawSun = function() {

};

var base = 800 / 2;

