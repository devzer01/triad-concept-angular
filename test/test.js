var assert = require('assert');
var moment = require('moment');
var oscilator = require('./oscilator.js');
describe('Oscilation', function() {
    describe('radiant test', function() {
        it('the calculation for single day angel should be correct', function() {
            let osc = new oscilator(400, 47, 87, "2017-01-14");
            let daytwo = osc.radiant();
            assert.equal(daytwo, Math.PI * 2 / 87, "incorrect match");
        });
        it('constructor params are set correctly', function () {
            let osc = new oscilator(400, 47, 87, "2017-01-14");
            assert.equal(osc.days, 87, "days for one year is correct");
            assert.equal(osc.distance, 47, "distance is set correctly");
        });

        it('0 day corrdinates should be on the base + distance', function() {
            let osc = new oscilator(400, 47, 87, "2017-01-14");
            let estimate = osc.position();
            assert.equal(estimate, -10.110872908105081, "should be on a flatline");
        });
        it('hour returns the correct position', function () {
            let osc = new oscilator(400, 47, 87, "2017-01-14");
            let hour = osc.hour();
            assert.equal(hour, 10, "should be on a flatline");
        });
/*        it('using current day', function() {
            let osc = new oscilator(400, 47, 87, "2017-01-14");
            let estimate = osc.estimate('2017-06-03');
            assert.equal(estimate.y, 388, "should be on a flatline");
            assert.equal(estimate.x, 355, "should be to the right of base on flat line");
        });*/
    });
});

