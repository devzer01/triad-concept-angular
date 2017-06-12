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

    let base = 1000 / 2;

    let ptimer;
    $scope.drawSystem = function () {
        $scope.moveday();
        $scope.grahaCharaya = $scope.getRashi();
        //mover();
    };



    function CalculateSolarSystem()
    {
        var day = Astronomy.DayValue (AstroDateTime);

        var text = "<code>" + AstroDateTime.toString() + "</code></br>";
        text += "<code>Day Value = " + day.toFixed(5) + "</code><br/>";
        $('divDateTime').innerHTML = text;

        $('th_x').title = CartesianCoordinateType + " x-coordinate in AU";
        $('th_y').title = CartesianCoordinateType + " y-coordinate in AU";
        $('th_z').title = CartesianCoordinateType + " z-coordinate in AU";

        $('th_x').style.backgroundColor = CartesianCoordinateColor[CartesianCoordinateType];
        $('th_y').style.backgroundColor = CartesianCoordinateColor[CartesianCoordinateType];
        $('th_z').style.backgroundColor = CartesianCoordinateColor[CartesianCoordinateType];
        $('th_distance').style.backgroundColor = CartesianCoordinateColor[CartesianCoordinateType];

        $('th_x').innerHTML = CartesianCoordinateType.charAt(0).toUpperCase() + "<sub>x</sub>";
        $('th_y').innerHTML = CartesianCoordinateType.charAt(0).toUpperCase() + "<sub>y</sub>";
        $('th_z').innerHTML = CartesianCoordinateType.charAt(0).toUpperCase() + "<sub>z</sub>";

        for (var i in Astronomy.Body) {
            AddRowForCelestialBody (Astronomy.Body[i], day);
        }

/*        HilightColors();

        CalculateSelectedBody (day);

        OnVisibilityChange();   */    // an object can rise or set at any time
    }

    function AddRowForCelestialBody (p, day)
    {
        var planetTable = $('planetTable');
        var pc = null;
        var distance = null;

        switch (CartesianCoordinateType) {
            case "heliocentric":
                distance = p.DistanceFromSun (day);
                pc = p.EclipticCartesianCoordinates (day);
                break;

            case "geocentric":
                distance = p.DistanceFromEarth (day);
                pc = p.GeocentricCoordinates (day);
                break;

            case "none":
                distance = 0.0;
                pc = { 'x':0.0, 'y':0.0, 'z':0.0 };
                break;

            default:
                throw ("Internal error - unknown cartesian coordinate type '" + CartesianCoordinateType + "'");
        }

        var location = new GeographicCoordinates (GeographicLongitude, GeographicLatitude, GeographicElevationInMeters);
        var mag = (p.Name == "Earth") ? "&nbsp;" : p.VisualMagnitude(day).toFixed(2);
        var sunAngle = (p.Name == "Earth") ? "&nbsp;" : Astronomy.AngleWithSunInDegrees (p, day).toFixed(1) + "&deg;";

        var row = InsertRow (planetTable, p.Name + "_row");
        var PRECISION = 7;
        var raHtml  = "&nbsp;";
        var decHtml = "&nbsp;";
        var eq = null;
        var constellation = "&nbsp;";

        if (p.Name != "Earth") {
            eq = p.EquatorialCoordinates (day, location);
            constellation = HtmlConstellation (eq);
            constellation = "<div style='text-align:center;' id='"+p.Name+"_constdiv'>" + constellation + "</div>"
        }

        switch (AngularCoordinateType) {
            case "equatorial":
                if (p.Name != "Earth") {
                    raHtml  = HtmlRightAscension (eq.longitude);
                    decHtml = HtmlDeclination (eq.latitude);
                }
                break;

            case "ecliptic":
                if (p.Name != "Sun") {
                    var ec = p.EclipticAngularCoordinates (day);
                    raHtml  = HtmlDeclination (ec.longitude);
                    decHtml = HtmlDeclination (ec.latitude);
                }
                break;

            case "horizontal":
                if (p.Name != "Earth") {
                    var hc = p.HorizontalCoordinates (day, location);
                    raHtml = HtmlDeclination (hc.azimuth);
                    decHtml = HtmlDeclination (hc.altitude);
                }
                break;

            default:
                throw ("Internal error - unknown angular coordinate type '" + AngularCoordinateType + "'");
        }

        var nameTextColor = NakedEyeObjects[p.Name] ? "#000000" : "#808060";
        InsertCell (planetTable, row, p.Name + "_name", "", "<div style='text-align:center; color:"+nameTextColor+";' id='"+p.Name+"_namediv'>" + p.Name + "</div>");
        InsertCell (planetTable, row, p.Name + "_x", "NumericData", pc.x.toFixed(PRECISION));
        InsertCell (planetTable, row, p.Name + "_y", "NumericData", pc.y.toFixed(PRECISION));
        InsertCell (planetTable, row, p.Name + "_z", "NumericData", pc.z.toFixed(PRECISION));
        InsertCell (planetTable, row, p.Name + "_distance", "NumericData", distance.toFixed(PRECISION));
        InsertCell (planetTable, row, p.Name + "_mag", "SmallNumericData", mag);
        InsertCell (planetTable, row, p.Name + "_SA", "SmallNumericData", sunAngle);
        InsertCell (planetTable, row, p.Name + "_const", "SmallNumericData", constellation);
        InsertCell (planetTable, row, p.Name + "_RA", "NumericData", raHtml);
        InsertCell (planetTable, row, p.Name + "_DEC", "NumericData", decHtml);
    }


    $scope.timeofday =  moment().format("YYYY-MM-DD hh:mm:ss");
  $scope.canvas = document.getElementById('myCanvas');
  $scope.context = $scope.canvas.getContext('2d');
  $scope.draw = {x: 500, y: 500 };
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
        distance: 75,
        init: {x: base + this.distance, y: base},
        zero: "2017-01-14",
        zerots: "2017-01-14 12:00:00",
        color: "silver",
        days: 88,
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
        init: {x: base + this.distance, y: base},
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
        aquarius: [23.25,24.00] ,
        pisces: [1.25,3.25] ,
        aries: [3.25,5.25] ,
        taurus: [5.25,7.25] ,
        gemini: [7.25,9.25] ,
        cancer: [9.25,11.25] ,
        leo: [11.25,13.25]};

    $scope.cz = {
        360: "cancer",
        330: "leo",
        300: "virgo",
        270: "gemini",
        240: "taurus",
        210: "aries",
        180: "pisces",
        150: "aquamarine",
        120: "capricorn",
        90: "sgitarius",
        60: "scorpio",
        30: "libra",
        0: "cancer"
    };

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

    $scope.planets = [$scope.mercury, $scope.venus, $scope.earth, $scope.mars,
       $scope.jupitor, $scope.saturn, $scope.uranus];
    //$scope.planets = [$scope.earth, $scope.jupitor];


    $scope.star = function (star) {
        let context = $scope.context;
        context.beginPath();
        context.arc($scope.draw.x, $scope.draw.y, star.mass, 0, Math.PI * 2, false);
        context.fillStyle = star.color;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = star.color;
        context.stroke();
    };

    $scope.axis = function(orbital) {
      let context = $scope.context;
      context.beginPath();
      context.arc($scope.draw.x, $scope.draw.y, orbital.distance, 0, 2 * Math.PI, true);
      context.lineWidth = 1;
      context.strokeStyle = 'black';
      context.stroke();
    };

    $scope.conctellation = ["cancer", "leo", "virgo", "libra", "scorpio", "sagittarius",
        "capricorn", "aquamarine", "pisces", "aries", "taurus", "gemini"];


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
            let x1 = base.x + (cos * distance);
            let y1 = base.y + (sin * distance);

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
            context.strokeStyle = "blue";
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

    $scope.drawLineToFrom = function (f, t, title, color) {
        let context = $scope.context;
        context.beginPath();
        context.moveTo(f.x, f.y);
        context.lineWidth = 1;
        context.lineTo(t.x, t.y);
        context.strokeStyle = color;
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

    let getDistance = function (d, b) {
        return Math.sqrt(Math.pow((d.x - b.x), 2) + Math.pow((d.y - b.y), 2));
    };

    $scope.move = function (planet, day) {

        let context = $scope.context;
        let ts = planet.zerots || planet.zero;
        let zero = moment(ts);
        let now = moment(Date.now());
        if (day) now = day;
        let calibration = now.diff(zero, "days");
        if (calibration > planet.days) {
            calibration = calibration % planet.days;
        }
        //let angle = (Math.PI * 2 / planet.days) * calibration;
        let gc = gcd(planet.days, 360);
        let angle = 360 / (calibration / planet.days) * gc;

        let x1 = base + Math.cos(angle)  * planet.distance;
        let y1 = base + Math.sin(angle)  * planet.distance;


        let k = flat(x1) + "" + flat(y1) + "" + planet.distance;
        if (!positions[k]) positions[k] = {x: flat(x1), y: flat(y1), name: planet.name};


        context.beginPath();
        context.arc(x1, y1, 5, 0, (2*Math.PI), false);
        context.fillStyle = planet.color;
        context.fill();
        context.lineWidth = planet.mass;
        context.strokeStyle = planet.color;
        context.stroke();
        context.fillStyle = "#000000";
        context.fillText(planet.name, x1, y1 + 20);
        return planet;
    };

    /**
     *
     * @param planet
     * @param day
     */
    let constellation = function (p, day) {
        var current = $scope.cz['0'];
        for (let i = 1; i <= 360; i++) {
            if (i % 30 === 0) {
                current = $scope.cz[i];
            }
            for (let zx = 1; zx <= 300; zx++) {
                let pi = (Math.PI * 2 / 360);
                let r = position(p, pi * i, zx);
                if (scan(p, r)) {
                    return current;
                }
            }
        }
    };

    $scope.orbital = [];
    $scope.day = moment();
    $scope.handler = null;

    $scope.moveday = function (day) {
        $scope.context.clearRect(0, 0, base * 2, base * 2);
        $scope.star($scope.sun);
        for (let i = 0; i < $scope.planets.length; i++) {
          $scope.axis($scope.planets[i]);
          $scope.planets[i] = $scope.move($scope.planets[i], day);
        }
        $scope.drawMarker(); //draw the clock face
        $scope.settimes();
    };

    $scope.settimes = function (day) {
        for (let x = 1; x < $scope.planets.length; x++) {

            let planet = $scope.planets[x];

            let zero = moment(planet.zero);
            let now = moment(Date.now());
            if (day) now = day;
            let calibration = now.diff(zero, "days");
            if (calibration > planet.days) {
                calibration = calibration % planet.days;
            }

            let angle = (Math.PI * 2 / planet.days) * calibration;

            let x1 = base + Math.cos(angle)  * planet.distance;
            let y1 = base + Math.sin(angle)  * planet.distance;


            $scope.planets[x].timeing = findTime(calibration, planet.days);
            $scope.planets[x].timeing.constellation = constellation({x: x1, y: y1});
        }

        $scope.drawPoints($scope.uranus.distance, $scope.getEarthXY(), "blue");
    };

    let mover = function() {
        if ($scope.handler === null) {
            $scope.handler = window.setInterval(function () {
                $scope.day = $scope.day.add(10, "days");
                $scope.moveday($scope.day);
            }, 100);
        }
    }

    function arc(base, distance, name) {
        context.beginPath();
        context.fillStyle = "#000000";
        context.arc(base.x, base.y, distance, 0, Math.PI * 2, false);
        context.stroke();
        if (name !== undefined) {
            let k = flat(base.x) + "" + flat(base.y) + "" + distance;
            if (!positions[k]) positions[k] = {x: flat(base.x), y: flat(base.y), name: name};
        }
    }

    function position(base, sector, distance) {
        let x = base.x + Math.cos(sector) * distance;
        let y = base.y + Math.sin(sector) * distance;

        return {x: x, y: y};
    }

    function rline(from, to, text, bold) {
        line(rtx, from, to, text, bold)
    }

    function sline() {

    }

    function line(ctx, from, to, text, bold) {
        context = ctx;
        context.beginPath();
        context.moveTo(from.x, from.y);
        if (bold) {
            context.lineWidth = 3;
        } else {
            context.lineWidth = 1;
        }
        context.lineTo(to.x, to.y);
        context.strokeStyle = '#94aeba';
        context.fillText(text, to.x, to.y + 10);
        context.stroke();
    }

    function clear() {
        rtx.clearRect(0, 0, 1000, 1000);
    }

    function flat(a) {
        if (a === undefined) return 0;
        return parseInt(a.toFixed(0));
    }

    function scan(x, y) {
        let entries = Object.keys(positions).filter(function (x) {
            let v = positions[x];
            return (flat(v.x) === flat(y.x) && flat(v.y) === flat(y.y))
        });
        if (entries.length > 0) {
            console.log("Found " + positions[entries[0]].name);
            return true;
        }
        return false;
    }


    function distance(d, b) {
        return Math.sqrt(Math.pow((d.x - b.x), 2) + Math.pow((d.y - b.y), 2));
    }

    let positions = {};


    /*arc(base, p2[0]);
    arc(base, 2);
    arc(base, p1[0]);
    let p = position(base, Math.PI * 2 / p1[1] * p1[2], p1[0]);
    arc(p, 2,  "alpha");
    let z = position(base, Math.PI * 2 / p2[1] * p2[2], p2[0]);
    arc(z, 2, "omega");*/

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
