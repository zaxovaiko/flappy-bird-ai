import config from "../config";

export class Pipe {
  width = config.PIPE_WIDTH;

  constructor(x, y, height) {
    this.height = height;
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    this.x -= config.PIPE_STEP;
  }
}

export function addPipes(array, count = 1) {
  for (let i = 0; i < count; i++) {
    const x =
      array.length === 0
        ? config.WINDOW_WIDTH
        : array[array.length - 1].x + config.PIPE_WIDTH + config.PIPE_DIS;

    const height =
      config.MIN_PIPE_HEIGHT +
      Math.floor(
        Math.random() *
          (config.WINDOW_HEIGHT - 2 * config.MIN_PIPE_HEIGHT - config.PIPE_GAP)
      );

    array.push(new Pipe(x, 0, height)); // top
    array.push(
      new Pipe(x, height + config.PIPE_GAP, config.WINDOW_HEIGHT - height)
    ); // bot
  }
}
