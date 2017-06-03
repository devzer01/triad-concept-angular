var moment = require('moment');
function Oscillator(base, distance, days, zeroday) {
    this.base = base;
    this.distance = distance;
    this.days = days;
    this.zeroday = zeroday;
}

/**
 * calculate angel per day
 * @param days
 */
Oscillator.prototype.radiant = function() {
    return Math.PI * 2 / this.days;
};

Oscillator.prototype.index = function () {
    let minutes = [];
    for (let i = 1; i < 60; i++) {
        let rad = (Math.PI * 2 / 60) * -1 * i;
        let x = this.base + Math.cos(rad) * this.distance;
        let y = this.base + Math.sin(rad) * this.distance;
        minutes[i] = {x: x, y: y};
    }
    return minutes
};

/**
 *
 * @param override override the calculation for a specific day
 */
Oscillator.prototype.position = function(override) {
    let a = moment(this.zeroday);
    let b = override != undefined ? moment(override, "x") : moment(Date.now());
    //&& override !== undefined
    return this.radiant(this.days) * -1 * a.diff(b, 'days');
};

Oscillator.prototype.estimate = function(override) {
    let rad = this.position(override);
    let x = this.base + Math.cos(rad) * this.distance;
    let y = this.base + Math.sin(rad) * this.distance;
    return {x: x, y: y};
};

Oscillator.prototype.hour = function() {
    let m = this.index();
    let matches = [];
    let angle = this.estimate();
    for (let i = 1; i < m.length - 1; i++ ) {
        console.log(m[i].x + ',' + m[i].y + ' ' + angle.x + ',' + angle.y + ' ' + m[i+1].x + ',' + m[i+1].y);
        if (m[i]  > angle.y && m[i+1] < angle.y && m[i].x > angle.x && m[i+1].x < angle.x) {
            matches.push(this.normalize(i));
        }
    }
    console.log(matches);
    return matches;
};

Oscillator.prototype.normalize = function(i) {
    //var i = record.index;
    //var x = parseInt(record.minutes);
    var hour = 0;
    if (i <= 12 && i >= 1) {
        hour = i + 3;
    } else {
        hour = i - 3;
    }
    if (hour > 12) hour -= 12;

    return hour;
    /*var minutes = 0;
    if (x <= 45) {
        minutes = x + 15;
    }*/
};

module.exports = Oscillator;