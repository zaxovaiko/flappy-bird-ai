function Pipe(width, height, color, x, y) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.xSpeed = 10;

    this.update = function () {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.closePath();
    }

    this.newPos = function () {
        this.x -= this.xSpeed;
    }
}