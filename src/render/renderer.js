export const Renderer = {
    /**
     * Draws a grid of colored pixels based on a pattern function.
     * @param {Object} options - Rendering options
     * @param {number} options.cols - Number of columns
     * @param {number} options.rows - Number of rows
     * @param {number} options.xOffset - X offset for pattern
     * @param {number} options.yOffset - Y offset for pattern
     * @param {Function} options.patternFn - Function to compute pixel state
     * @param {string[]} options.palette - Array of hex or RGBA colors
     * @param {number} options.width - Canvas width
     * @param {number} options.height - Canvas height
     * @param {number} options.numTransparentStates - Number of transparent states
     * @param {p5.Graphics} [buffer] - Optional off-screen buffer
     */
    drawBitGrid: ({ cols, rows, xOffset, yOffset, patternFn, palette, width, height, numTransparentStates }, buffer = null) => {
        const target = buffer || window;
        target.loadPixels();
        const cellW = width / cols;
        const cellH = height / rows;

        for (let py = 0; py < height; py++) {
            const row = Math.floor(py / cellH);
            for (let px = 0; px < width; px++) {
                const col = Math.floor(px / cellW);
                const v = patternFn(col + xOffset, row + yOffset);
                const idx = 4 * (px + py * width);

                // compute “palette index” after skipping transparent slots
                const pi = v - numTransparentStates;

                if (pi < 0 || pi >= palette.length) {
                    // out-of-range → fully transparent
                    target.pixels[idx + 3] = 0;
                } else {
                    // valid palette entry → draw opaque
                    const hex = palette[pi].replace(/^#/, '');
                    const iv = parseInt(hex, 16);
                    target.pixels[idx + 0] = (iv >> 16) & 0xFF;
                    target.pixels[idx + 1] = (iv >> 8) & 0xFF;
                    target.pixels[idx + 2] = iv & 0xFF;
                    target.pixels[idx + 3] = 255;
                }
            }
        }

        target.updatePixels();
    },

    /**
     * Renders multiple layers by compositing them onto the main canvas.
     * @param {Object[]} layers - Array of layer configurations
     * @param {number} gridSize - gridSize
     * @param {number} margin - margin
     */
    drawLayers: (layers, gridSize, margin = 0) => {
        layers.forEach(layer => {
            const buffer = createGraphics(gridSize, gridSize);
            Renderer.drawBitGrid({
                ...layer,
                width: gridSize,
                height: gridSize,
                numTransparentStates: layer.numTransparentStates,
            }, buffer);
            image(buffer, margin, margin); // Composite layer onto main canvas
        });
    },
};