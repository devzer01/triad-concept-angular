/**
 * Created by nayana on 3/6/2560.
 */

function PaintBrush(context) {
    this.context = context;
    this.base = 800 / 2;
};

PaintBrush.prototype.getContext = function () {
    return this.context;
};

PaintBrush.prototype.axis = function(orbital) {
    let context = this.getContext();
    context.beginPath();
    context.arc(this.base, this.base, orbital.distance, 0, 2 * Math.PI, true);
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.stroke();
};

/**
 * @param x1
 * @param y1
 * @param color
 * @param name
 * @param width
 */
PaintBrush.prototype.drawArc = function(x1, y1, color, name, width) {
    let context = this.getContext();

    context.beginPath();
    context.arc(x1, y1, 5, 0, (2*Math.PI), false);
    context.fillStyle = color;
    context.fill();
    context.lineWidth = width;
    context.strokeStyle = color;
    context.stroke();
    context.fillStyle = "#000000";
    context.fillText(name, x1, y1 + 20);
    context.stroke();
};

PaintBrush.prototype.drawLineToCenter = function (x1, y1, title) {

    let context = this.getContext();

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineWidth = 1;
    context.lineTo(base, base);
    context.strokeStyle = '#94aeba';
    context.fillText(title, x1, y1 + 20);
    context.stroke();
};

PaintBrush.prototype.clear = function() {
    this.getContext().clearRect(0, 0, base * 2, base * 2);
};
