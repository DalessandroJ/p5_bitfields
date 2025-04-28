export default {
    /* canvas */
    canvasWidth: 1080,
    canvasHeight: 1350,
    gridSize: 1024,
    get margin() { return (this.canvasWidth - this.gridSize) / 2 },

    /* states */
    maxStates: 32,
    transparentFraction: [0.5, 1.5],   // min-max multiplier

    /* layer generation */
    layerCount: [5, 9],
    baseModRange: [1, 10],
    bandSizeRange: [1, 10],
    offsetRange: [0, 256],

    /* rendering tweaks */
    noiseAmplitude: 8,

    /* text */
    textFont: '"Courier New", monospace',
    textSize: 24,
    textWeight: "bold"
};
