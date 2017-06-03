function Oscillator(base, distance, days, zeroday) {
    this.base = base;
    this.distance = distance;
    this.days = days;
    this.zeroday = zeroday;

    this.x = 0;
    this.y = 0;
    this.rad = 0;
    this.date = moment(Date.now(), "x").format("YYYY-MMM-DD");
    this.zerodiff = 0;
    this.cos = 0;
    this.sin = 0;
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

    let b = override != null ? moment(override, "x") : moment(Date.now());
    this.date = b.format("YYYY-MMM-DD");
    this.rad = this.radiant();
    this.zerodiff = a.diff(b, 'days');
    if (Math.abs(this.zerodiff) > this.days) {
        this.zerodiff = Math.abs(this.zerodiff) % this.days;
    }
    //if (this.zerodiff < 0) multiplier = 1;
    return this.rad  * this.zerodiff;
};

Oscillator.prototype.estimate = function(override) {
    this.rad = this.position(override);
    this.cos = (Math.cos(this.rad));
    this.sin = (Math.sin(this.rad));
    this.tan = (Math.tan(this.rad));
    this.x = this.base + (this.cos * this.distance);
    this.y = this.base + (this.sin * this.distance);
    return {x: this.x, y: this.y};
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