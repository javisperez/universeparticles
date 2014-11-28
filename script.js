var d = document,
        c = d.getElementById('canvas'),
        cx = c.getContext('2d'),
        pAmount = 450,
        particles = [],
        explosions = [],
        m = Math,
        mouseX,
        mouseY,
        oldMouseX,
        oldMouseY,
        mvel,
        mxdir,
        mydir,
        mxvel,
        myvel,
        mouseDown = false,
        texture = new Image(),
        g = 0;

c.width = window.innerWidth;
c.height = window.innerHeight;

var centerx = c.width / 2;
var centery = c.height / 2;

function makeParticles(amount) {
    if (amount > pAmount) {
        amount = pAmount;
    }

    while (amount--) {
        var p = new particle(centerx + m.random() * 10, centery + m.random() * 10);

        p.type = 'point';

        p.fill = false;

        p.image = texture;

        p.velX = m.random() * 10 - 5;
        p.velY = m.random() * 10 - 5;

        p.size = m.random() * 4 + 0.5;

        p.alpha = m.random();

        var rndR = 180 + m.round(m.random() * 75);
        var rndG = 180 + m.round(m.random() * 75);
        var rndB = 180 + m.round(m.random() * 75);

        p.color = rndR + ',' + rndG + ',' + rndB;

        particles.push(p);
    }
    while (particles.length > pAmount) {
        particles.shift();
    }
}

function draw() {

    cx.clearRect(0, 0, c.width, c.height);

    makeParticles(1);

    i = particles.length;

    while (i--) {
        particles[i].render(cx);

        particles[i].update();
    }

}

d.onmousemove = function (e) {

    oldMouseX = mouseX;
    oldMouseY = mouseY;

    mouseX = e.pageX;
    mouseY = e.pageY;

    mvel = m.sqrt(m.pow(mouseX - oldMouseX, 2) + m.pow(mouseY - oldMouseY, 2));

    mxdir = (mouseX - oldMouseX > 0 ? 1 : -1);
    mydir = (mouseY - oldMouseY > 0 ? 1 : -1);

    mxvel = m.sqrt(m.pow(mouseX - oldMouseX, 2));
    myvel = m.sqrt(m.pow(mouseY - oldMouseY, 2));
}

d.onmousedown = function () {
    mouseDown = true;
}

d.onmouseup = function () {
    mouseDown = false;
}

setInterval(draw, 30);

/**
 particle class
 */
function particle(posX, posY) {
    this.type = "point";

    this.size = 1;
    this.shrink = 1;

    this.posX = posX;
    this.posY = posY;

    this.oldX = posX;
    this.oldY = posY;

    this.dragX = 1;
    this.dragY = 1;

    this.velX = 1;
    this.velY = 1;

    this.alpha = 1;
    this.fade = 0;

    this.gravity = 0;

    this.color = '0,0,0';

    this.friction = 0.9;
}

particle.prototype.update = function () {
    this.fill = true;

    this.oldX = this.posX;
    this.oldY = this.posY;

    this.velX *= this.dragX;
    this.velY *= this.dragY;

    this.posX += this.velX;
    this.posY += this.velY;

    this.velY += this.gravity;

    this.alpha -= this.fade;

    this.size *= this.shrink;

    this.size = Math.max(0, this.size);

    this.alpha = Math.max(0, this.alpha);

    rx = (centerx + m.random() * 10) - this.posX;
    ry = (centery + m.random() * 10) - this.posY;

    distance = Math.sqrt(rx * rx + ry * ry) || 0.001;

    rx /= distance;
    ry /= distance;

    if (!mouseDown) {
        var acceleration = (1 - (distance / (centerx+centery/4))) * 0.42;
        this.velX += rx * acceleration;
        this.velY += ry * acceleration;
    }
}

particle.prototype.render = function (context) {

    if (this.alpha == 0)
        return;

    context.fillStyle = "rgba(" + this.color + "," + Math.max(0, this.alpha) + ")";

    context.strokeStyle = "rgba(" + this.color + "," + Math.max(0, this.alpha) + ")";

    context.beginPath();
    context.arc(this.posX, this.posY, this.size, 0, Math.PI * 2, true);
    context.closePath();

    if (this.fill) {
        context.fill();
    } else {
        context.stroke();
    }
}