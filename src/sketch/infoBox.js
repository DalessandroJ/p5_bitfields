import { randomInt } from "./utils.js";
import { OPS } from "../render/ops.js";

export function drawInfoBox({
    cfg,
    palette,
    darkest,
    lightest,
    bgCol,
    numStates,
    numTransparentStates,
    totalStates,
    numLayers,
    chosenPalName
}) {
    // rectangle
    const rectHex =
        bgCol === darkest ? lightest :
            bgCol === lightest ? darkest :
                [darkest, lightest][randomInt(0, 1)];

    fill(`#${rectHex}`);
    noStroke();
    rect(
        cfg.margin,
        cfg.gridSize + cfg.margin * 2,
        cfg.gridSize,
        cfg.canvasHeight - cfg.gridSize - cfg.margin * 3
    );

    // text prep
    textSize(cfg.textSize);
    textAlign(LEFT, TOP);
    textLeading(cfg.margin);
    textFont(cfg.textFont);
    textStyle(cfg.textWeight);
    const textHex = rectHex === darkest ? lightest : darkest;

    const lines = [
        `OPS        : ${OPS}`,
        `States     : ${numTransparentStates} transparent, ${numStates} filled, ${totalStates} total`,
        `Base, Band : ∈ ℤ ∩ [1, 10]`,
        `Layers     : ${numLayers}`,
        `Palette    : ${chosenPalName}`
    ];

    // place text
    fill(`#${textHex}`);
    const txtX = cfg.margin * 2;
    const txtY = cfg.gridSize + cfg.margin * 3;
    lines.forEach((l, i) => text(l, txtX, txtY + i * cfg.margin, cfg.gridSize - cfg.margin * 2));

    // measure block height for swatches
    const hText = textAscent() + textDescent() + (lines.length - 1) * textLeading();
    const swatchY = Math.round(txtY + hText + cfg.margin);
    const swatchH = cfg.canvasHeight - cfg.margin - swatchY;
    const swatchW = cfg.gridSize / palette.length;

    // swatch row
    loadPixels();
    palette.forEach((hex, i) => {
        const v = parseInt(hex.replace(/^#/, ""), 16);
        const r = (v >> 16) & 0xff;
        const g = (v >> 8) & 0xff;
        const b = v & 0xff;

        const x0 = Math.round(cfg.margin + i * swatchW);
        const x1 = Math.round(cfg.margin + (i + 1) * swatchW);

        for (let y = swatchY; y < swatchY + swatchH; y++) {
            const rowBase = 4 * y * cfg.canvasWidth;
            for (let x = x0; x < x1; x++) {
                const idx = rowBase + 4 * x;
                pixels[idx] = r;
                pixels[idx + 1] = g;
                pixels[idx + 2] = b;
                pixels[idx + 3] = 255;
            }
        }
    });
    updatePixels();
}
