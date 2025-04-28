import cfg from "./config.js";
import {
    commonDivisors,
    randomInt,
    randomFloat
} from "./utils.js";
import { minMaxLum } from "./utils.js";
import { saveStamped } from "./utils.js";
import { Renderer } from "../render/renderer.js";
import { makeLayer } from "../render/layer.js";
import { drawInfoBox } from "./infoBox.js";

//------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------

// Bitfield generator!
// 1. Canvas creation, state selection, palette selection
// 2. Layer generation and rendering
// 3. Noise pass
// 4. Save image
export async function setup() {
    noLoop();

    //Load the JSON. (no longer preload() as of p5@2.0.0)
    const masterPalettes = await loadJSON('data/masterPalettes.json');

    //create the canvas based on sizes in config
    createCanvas(cfg.canvasWidth, cfg.canvasHeight);
    pixelDensity(1);

    // States
    const numStates = randomInt(2, cfg.maxStates);
    const numTransparentStates = Math.floor(randomFloat(...cfg.transparentFraction) * numStates);
    const totalStates = numStates + numTransparentStates;

    // Palette
    const listOfPalettes = masterPalettes[numStates];
    const chosenPal = random(listOfPalettes);
    const palette = chosenPal.colors;
    const { darkest, lightest } = minMaxLum(palette); //get darkest and lightest palette colors
    const bgCol = `${palette[randomInt(0, palette.length - 1)]}`; //set bg to random palette color
    background(`#${bgCol}`);

    // Layers
    const numLayers = randomInt(...cfg.layerCount);
    const divisors = commonDivisors(cfg.gridSize, cfg.gridSize);
    const layers = Array.from({ length: numLayers }, () => ({
        ...makeLayer(cfg, totalStates, divisors),
        palette,
        numTransparentStates
    }));
    Renderer.drawLayers(layers, cfg.gridSize, cfg.margin);

    //---------------------------------------------------------------------
    //---------------------------------------------------------------------

    //draw the info box
    drawInfoBox({
        cfg,
        palette,
        darkest,
        lightest,
        bgCol,
        numStates,
        numTransparentStates,
        totalStates,
        numLayers,
        chosenPalName: chosenPal.name
    });

    //now add noise
    loadPixels();
    for (let i = 0; i < pixels.length; i += 4) {
        // random brighten/darken
        const d = randomInt(-cfg.noiseAmplitude, cfg.noiseAmplitude);
        pixels[i] = constrain(pixels[i] + d, 0, 255); // R
        pixels[i + 1] = constrain(pixels[i + 1] + d, 0, 255); // G
        pixels[i + 2] = constrain(pixels[i + 2] + d, 0, 255); // B
        // leave pixels[i+3] (alpha) untouched
    }
    updatePixels();

    //never remove, for documenting purposes
    saveStamped(numStates, numTransparentStates, chosenPal.name);
}

window.setup = setup;