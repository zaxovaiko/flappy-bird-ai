function BirdComponent(radius, color, x, y) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.g = 0.5;
    this.gSpeed = 0;

    this.update = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;
    }

    this.newPos = function () {
        this.gSpeed += this.g;
        this.y += this.gSpeed;
    }

    this.checkCollision = function () {
        if (this.y < 0 || this.y > canvas.height) {
            return true;
        }

        let res = false;
        pipes.forEach(e => {
            if (
                // check if inside the top pipe and bot
                (e[0].x <= this.x + this.radius && this.x - this.radius <= e[0].x + e[0].width &&
                 e[0].y <= this.y + this.radius && this.y - this.radius <= e[0].height)
                ||
                (e[1].x <= this.x + this.radius && this.x - this.radius <= e[1].x + e[1].width &&
                 e[1].y <= this.y + this.radius && this.y - this.radius <= e[1].y + e[1].height)
            ) {
                res = true;
            }
        });
        return res;
    }
}