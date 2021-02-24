const canvas = document.getElementById("canvas");
const score = document.getElementById("score");
const maxScore = document.getElementById("max");
const generation = document.getElementById("generation");
const ctx = canvas.getContext("2d");

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let counter = 0;
let justGenerated = false;
let pipes = [];
let birds = [];
let weights = [];

document.onkeypress = function (e) {
    if (e.key === "q") {
        clearInterval(interval);
        console.log("Stopped");
    }
};

function addPipes() {
    counter++;
    score.innerHTML = String(parseInt(score.innerHTML) + 1);
    
    if (parseInt(maxScore.innerHTML) < score.innerHTML) {
        maxScore.innerHTML = score.innerHTML;
    }

    const height = Math.random() * (canvas.height - 200);
    const width = Math.random() * 300 + canvas.width;

    pipes.push([
        new Pipe(70, height, "darkgreen", width, 0), // top
        new Pipe(70, canvas.height, "darkgreen", width, height + 170), // bot
    ]);
}

score.innerHTML = "-1";
addPipes(); // Add initial pipes
nextGeneration();

function nextGeneration() {
    console.log(tf.memory());
    console.log(weights.length > 0 && weights[0].print());
    console.log("Next generation " + +generation.innerHTML);

    for (let i = 0; i < 10; i++) {
        birds.push(new BirdComponent(25, "blue", 150, 150));
        birds[i].brain = new AI();

        const wc = [];
        for (let j = 0; j < weights.length; j++) {
            const values = weights[j].dataSync().slice();
            for (let k = 0; k < values.length; k++) {
                values[k] += (Math.random() * 2 - 1) / 10;
            }
            const nt = tf.tensor(values, weights[j].shape);
            wc[j] = nt;
        }

        if (weights.length > 0) {
            birds[i].brain.model.setWeights(wc);
        }
    }

    weights.forEach(e => e.dispose());

    score.innerHTML = "0";
    generation.innerHTML = String(parseInt(generation.innerHTML) + 1);
    justGenerated = true;
}

function loop() {
    clear();

    if (birds.length === 0) {
        nextGeneration();
    }

    for (let i = 0; i < birds.length; i++) {
        let bird = birds[i];

        if (!justGenerated && bird.checkCollision()) {
            weights = [...bird.brain.model.getWeights()].map(e => e.clone());
            birds.splice(i, 1);
            bird.brain.model.dispose();
            bird = null;
            continue;
        }

        const xd = pipes[0][0].x - bird.x - bird.radius; // X distance to pipe
        const yt = bird.y - bird.radius - pipes[0][0].height; // Y dis to Top pipe
        const yb = bird.y + bird.radius - pipes[0][1].y; // Y dis to Bot pipe

        const jump = bird.brain.predict([bird.gSpeed, xd, yt, yb]);

        if (jump[0] > jump[1]) {
            bird.gSpeed = -9.7;
        }

        bird.newPos();
        bird.update();
    }

    // remove pipes that are behind us
    const lengthBefore = pipes.length;
    pipes = pipes.filter((e) => e[0].x + e[0].width > 0);

    if (lengthBefore !== pipes.length) {
        addPipes();
        justGenerated = false;
    }

    pipes.forEach((e) => {
        e.forEach((pipe) => {
            pipe.newPos();
            pipe.update();
        });
    });
}

const interval = setInterval(loop, 20);
