let numStates;
let totalStates;

const OPS = [
    (a, b) => a & b,   // AND
    (a, b) => a ^ b,   // XOR
    (a, b) => a | b,   // OR
    //(a, b) => a << b,  //left shift
    //(a, b) => a >> b,  //right shift
];
const chosenOp = OPS[Math.floor(Math.random() * OPS.length)];

//--------------------------------------------------------------------------------------

async function setup() {
    noLoop();

    //this is how we do it in p5js 2.0.0 because they removed preload()
    const masterPalettes = await loadJSON('data/masterPalettes.json');

    const canvasSize = 1080;
    const gridSize = 1024;
    const margin = (canvasSize - gridSize) / 2; //28px
    createCanvas(canvasSize, 1350);
    pixelDensity(1);

    //get all divisors of the canvas dimensions
    const divisors = Utils.commonDivisors(gridSize, gridSize);
    //console.log(divisors);

    // pick how many colors and transparencies we want
    const maxStates = 32;
    numStates = Utils.randomInt(2, maxStates);
    const numTransparentStates = Utils.randomInt(Math.floor(numStates / 2), Math.floor(numStates * 1.5));
    totalStates = numStates + numTransparentStates;

    // grab a random palette of exactly numStates colors
    const listOfPalettes = masterPalettes[numStates];
    const chosenPal = random(listOfPalettes);
    const palette = chosenPal.colors;
    console.log(palette);
    console.log(`${numStates} states | ${numTransparentStates} transparent | Chosen palette: ${chosenPal.name}`);

    //set background to a random color from the palette
    const bgCol = `${palette[Utils.randomInt(0, palette.length - 1)]}`;
    background(`#${bgCol}`);
    //get the darkest and lightest color from the palette
    const { darkest, lightest } = Utils.minMaxLum(palette);

    // 3) decide how many layers you want
    const numLayers = Utils.randomInt(5, 9);
    const layers = [];

    for (let i = 0; i < numLayers; i++) {
        // randomize per-layer operator, baseModulus & bandSize
        const layerOp = OPS[Utils.randomInt(0, OPS.length - 1)];
        const layerBase = Utils.randomInt(1, 10);
        const layerBand = Utils.randomInt(1, 10);
        const layerMode = 1; //Utils.randomInt(0, 1); //0 for radial, 1 for rows-based

        // pick a non-1 and non-gridSize divisor for cell size
        const cSize = divisors[Utils.randomInt(1, divisors.length - 2)];
        const cols = gridSize / cSize;
        const rows = gridSize / cSize;
        const xOffset = Utils.randomInt(0, 256);
        const yOffset = Utils.randomInt(0, 256);

        // center in “cell coords” (after offset)
        const centerX = cols / 2 + xOffset;
        const centerY = rows / 2 + yOffset;

        const patternFn = (x, y) => {
            let step;
            if (layerMode === 0) {
                // concentric rings
                step = Math.floor(Math.hypot(x - centerX, y - centerY) / layerBand);
            } else {
                // original horizontal bands
                step = Math.floor(y / layerBand);
            }

            const t = layerBase + step;
            let v = layerOp(x + y, y - x) % t;
            if (v < 0) v += t;
            return v % totalStates;
        };

        layers.push({
            cols,
            rows,
            xOffset,
            yOffset,
            patternFn,
            palette,
            numTransparentStates
        });
    }

    // 4) draw them all
    Renderer.drawLayers(layers, gridSize, margin);

    //------------------------------------------------------------------------------------------------------------------------------------------

    //draw a rectangle to put text into
    // if bgCol is darkest pick lightest, else if it's lightest pick darkest, else random between them
    const rectHex = bgCol === darkest ? lightest : bgCol === lightest ? darkest : [darkest, lightest][Utils.randomInt(0, 1)];
    fill(`#${rectHex}`);
    noStroke();
    rect(
        margin,
        gridSize + (margin * 2),
        gridSize,
        height - gridSize - (3 * margin)
    );

    //create textbox in the rectangle
    const textBox = {
        x: margin * 2,                // in from the rect’s left edge
        y: gridSize + (margin * 3),  // down from its top edge
        w: gridSize - (margin * 2),    // allow margin padding on left & right
        lh: margin                       // line-height
    };

    //create text settings
    textSize(24);
    textAlign(LEFT, TOP);
    textLeading(textBox.lh);
    textFont('"Courier New", monospace');
    textStyle(BOLD);
    const textHex = rectHex === darkest ? lightest : darkest;

    //write the text lines
    const lines = [
        `OPS        : ${OPS}`,
        `States     : ${numTransparentStates} transparent, ${numStates} filled, ${totalStates} total`,
        `Base, Band : ∈ \u2124 ∩ [1, 10]`,
        `Layers     : ${numLayers}`,
        `Palette    : ${chosenPal.name}`,
    ];

    // 1) Measure text block height
    const ascent = textAscent();             // px above baseline
    const descent = textDescent();            // px below baseline
    const linesCount = lines.length;
    const totalTextH = ascent + descent + (linesCount - 1) * textLeading();

    // 1) compute integer bounds for the swatches row
    const rectBottomY = height - margin;                   // bottom of the textbox
    const swatchY = Math.round(textBox.y + totalTextH + margin);
    const swatchH = rectBottomY - swatchY;
    const swatchW = gridSize / palette.length;
    const cw = width;                             // canvas width for indexing

    //draw swatches row without using rect
    loadPixels();
    palette.forEach((hex, i) => {
        // 2) parse the color
        const v = parseInt(hex.replace(/^#/, ''), 16);
        const r = (v >> 16) & 0xFF;
        const g = (v >> 8) & 0xFF;
        const b = v & 0xFF;

        // 3) compute integer x-bounds
        const x0 = Math.round(margin + i * swatchW);
        const x1 = Math.round(margin + (i + 1) * swatchW);

        // 4) fill pixels in that box
        for (let y = swatchY; y < swatchY + swatchH; y++) {
            const rowBase = 4 * (y * cw);
            for (let x = x0; x < x1; x++) {
                const idx = rowBase + x * 4;
                pixels[idx] = r;
                pixels[idx + 1] = g;
                pixels[idx + 2] = b;
                pixels[idx + 3] = 255;
            }
        }
    });
    updatePixels();

    //now add noise to everything but the text
    const noiseAmp = 8;
    loadPixels();
    for (let i = 0; i < pixels.length; i += 4) {
        // random brighten/darken
        const d = Utils.randomInt(-noiseAmp, noiseAmp);
        pixels[i] = constrain(pixels[i] + d, 0, 255); // R
        pixels[i + 1] = constrain(pixels[i + 1] + d, 0, 255); // G
        pixels[i + 2] = constrain(pixels[i + 2] + d, 0, 255); // B
        // leave pixels[i+3] (alpha) untouched
    }
    updatePixels();

    //finally draw the text to the screen
    fill(`#${textHex}`);
    lines.forEach((line, i) => {
        text(line,
            textBox.x,
            textBox.y + i * textBox.lh,
            textBox.w    // wrap if it exceeds box width
        );
    });

    //never remove, for documenting purposes
    Utils.saveStamped(numStates, numTransparentStates, chosenPal.name);
}