function AI() {
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

    this.predict = function (input) {
        const out = tf.tidy(() => {
            const xs = tf.tensor2d([input]);
            const ys = this.model.predict(xs);
            const out = ys.dataSync();
            return out;
        });
        return out;
    };
}
