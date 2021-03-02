import config from "./config";
import { addBirds, Bird } from "./components/bird";
import { addPipes } from "./components/pipe";
import * as tf from "@tensorflow/tfjs";

// Info
const maxInfo = document.getElementById("max");
const scoreInfo = document.getElementById("score");
const generationInfo = document.getElementById("generation");

// Buttons
const runBtn = document.getElementById("run");
const stopBtn = document.getElementById("stop");
const saveBtn = document.getElementById("save");
const loadBtn = document.getElementById("load");
const speedBtn = document.getElementById("speed");

// Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Helper vars
let interval;
let speed = 1;
let currentScore = 0;

let weights;
let distanceToClosestPipe = 0;
let distanceToClosestTopPipe = 0;
let distanceToClosestBotPipe = 0;

// Drawable objects
const pipes = [];
const birds = [];

speedBtn.onchange = (e) => {
  speed = +e.target.value;
};

runBtn.onclick = () => {
  loop();
};

stopBtn.onclick = () => {
  clearInterval(interval);
};

loadBtn.onclick = async () => {
  const model = await tf.loadLayersModel(config.URL_STRING);
  weights = [...model.getWeights()].map((e) => e.clone());

  for (let i = 0; i < birds.length; i++) {
    birds[i].brain.model.dispose();
    birds.splice(i--, 1);
  }

  model.dispose();
  addBirds(birds, config.BIRDS, weights);
  console.log("Model was loaded");
};

saveBtn.onclick = async () => {
  stopBtn.click();
  if (birds.length > 0) {
    await birds[0].brain.model.save(config.URL_STRING);
    console.log("Model was saved");
  }
  runBtn.click();
};

function init() {
  addPipes(pipes, 2);
  addBirds(birds, config.BIRDS);
}

function makeNextGeneration() {
  console.log("Next generation");

  addPipes(pipes);
  pipes.splice(0, 2);
  addBirds(birds, config.BIRDS, weights);

  weights.forEach((e) => e.dispose());
  weights = null;

  // Update and reset score information
  if (+maxInfo.innerHTML < currentScore) {
    maxInfo.innerHTML = currentScore;
  }
  currentScore = 0;
  scoreInfo.innerHTML = 0;
  generationInfo.innerHTML = +generationInfo.innerHTML + 1;
}

function normalize(array) {
  const normalization = {
    0: 1,
    1: canvas.width,
    2: canvas.height,
    3: canvas.height,
  };
  return array.map((e, i) => e / normalization[i]);
}

function loop() {
  interval = setInterval(() => {
    for (let i = 0; i < speed; i++) {
      // Clear field
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // If there does not left any bird then make next generation
      if (birds.length === 0) {
        makeNextGeneration();
      }

      // Check collisions
      // TODO: Optimize. Skip pipes which are far away
      for (let i = 0; i < pipes.length; i++) {
        if (birds.length > 0 && birds[0].x + birds[0].radius < pipes[i].x) {
          distanceToClosestPipe = pipes[i].x - birds[0].radius - birds[0].x;
          distanceToClosestTopPipe =
            birds[0].y - birds[0].radius - pipes[i].height;
          distanceToClosestBotPipe = pipes[i].y - birds[0].y - birds[0].radius;
          break;
        }
        for (let j = 0; j < birds.length; j++) {
          if (birds[j].collision(pipes[i])) {
            if (birds.length === 1) {
              weights = birds[j].brain.copyWeights();
            }
            birds[j].brain.model.dispose();
            birds.splice(j--, 1);
          }
        }
      }

      // Draw visible pipes
      // If pipe is behind the scene remove 2 pipes (top and bottom)
      for (let i = 0; i < pipes.length; i++) {
        if (pipes[i].x + pipes[i].width <= 0) {
          pipes.splice(i--, 2);
          addPipes(pipes);
          scoreInfo.innerHTML = currentScore++;
          continue;
        }
        pipes[i].move();
        pipes[i].draw(ctx);
      }

      // Draw birds
      // Predict jump or not
      for (const bird of birds) {
        // Prepare dataset and normalize data
        const input = [
          bird.gSpeed,
          distanceToClosestPipe,
          distanceToClosestTopPipe,
          distanceToClosestBotPipe,
        ];
        const jump = bird.brain.predict(normalize(input));

        if (jump[0] > jump[1]) {
          bird.gSpeed = -9.7;
        }

        bird.move();
        bird.draw(ctx);
      }
    }
  }, config.INTERVAL);
}

init();
loop();
