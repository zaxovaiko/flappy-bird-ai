import * as tf from "@tensorflow/tfjs";

export class Brain {
    constructor() {
        this.model = tf.sequential({
            layers: [
                tf.layers.dense({ inputShape: [4], units: 4, activation: "sigmoid" }),
                tf.layers.dense({ units: 2 }),
            ],
        });
    }

    predict(input) {
        return tf.tidy(() => this.model.predict(tf.tensor2d([input])).dataSync());
    }

    copyWeights() {
        return [...this.model.getWeights()].map((e) => e.clone());
    }

    setMutatedWeights(weights) {
        tf.tidy(() => {
            const x = this.copyWeights(weights).map((e) => e.add(tf.randomUniform(e.shape, -0.1, 0.1)));
            this.model.setWeights(x);
        });
    }
}
