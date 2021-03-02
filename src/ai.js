import * as tf from "@tensorflow/tfjs";

export class Brain {
  constructor() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [4],
          units: 4,
          activation: "sigmoid",
          useBias: true,
        }),
        tf.layers.dense({ units: 4, activation: "sigmoid" }),
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
      this.model.setWeights(
        [...weights].map((e) =>
          e.clone().add(tf.randomUniform(e.shape, -0.1, 0.1))
        )
      );
    });
  }
}
