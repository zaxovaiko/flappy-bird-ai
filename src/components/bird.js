import { Brain } from "../ai";
import config from "../config";

export class Bird {
    g = 0.5;
    gSpeed = 0;

    constructor(x, y) {
        this.radius = config.BIRD_RADIUS;
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.fillStyle = "blue";
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;
    }

    move() {
        this.gSpeed += this.g;
        this.y += this.gSpeed;
    }

    collision(pipe) {
        if (this.y - this.radius <= 0 || this.y + this.radius >= config.WINDOW_HEIGHT) {
            return true;
        }

        const distX = Math.abs(this.x - pipe.x - pipe.width / 2);
        const distY = Math.abs(this.y - pipe.y - pipe.height / 2);

        if (distX > pipe.width / 2 + this.radius || distY > pipe.height / 2 + this.radius) {
            return false;
        }
        if (distX <= pipe.width / 2 || distY <= pipe.height / 2) {
            return true;
        }

        const dx = distX - pipe.width / 2;
        const dy = distY - pipe.height / 2;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }
}

export function addBirds(array, count, weights) {
    for (let i = 0; i < count; i++) {
        array.push(new Bird(config.BIRD_POS_X, config.WINDOW_HEIGHT / 2));
        array[i].brain = new Brain();
        if (weights) {
            array[i].brain.setMutatedWeights(weights);
        }
    }
}
