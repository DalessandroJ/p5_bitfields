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
const baseModulus = Utils.randomInt(1, 10);          // starting t
const bandSize = Utils.randomInt(1, 10);            // increase t every ___ rows

//--------------------------------------------------------------------------------------

//TODO
//make it so it only draws in a square of largest power of two and possible cell sizes are only powers of two so each cell fits nicely with others stopping the dreaded small slivers

async function setup() {
    noLoop();

    //this is how we do it in p5js 2.0.0 because they removed preload()
    const masterPalettes = await loadJSON('data/masterPalettes.json');

    const w = windowWidth;
    const h = w * (5 / 4);
    createCanvas(w, h);
    pixelDensity(1);

    //get all divisors of the canvas dimensions
    const divisors = Utils.commonDivisors(w, h);
    console.log(divisors);

    // pick how many colors and transparencies we want
    const maxStates = 32;
    numStates = Utils.randomInt(2, maxStates);
    const numTransparentStates = Utils.randomInt(Math.floor(numStates / 2), Math.floor(numStates*1.5));
    totalStates = numStates + numTransparentStates;

    // grab a random palette of exactly numStates colors
    const listOfPalettes = masterPalettes[numStates];
    const chosenPal = random(listOfPalettes);
    const palette = chosenPal.colors;
    console.log(`${numStates} states | ${numTransparentStates} transparent | Chosen palette: ${chosenPal.name}`);

    //set background to a random color from the palette
    background(`#${palette[Utils.randomInt(0, palette.length - 1)]}`);


    // 3) decide how many layers you want
    const numLayers = 8;//Utils.randomInt(2, 6);
    const layers = [];

    for (let i = 0; i < numLayers; i++) {
        // randomize per-layer operator, baseModulus & bandSize
        const layerOp = OPS[Math.floor(Math.random() * OPS.length)];
        const layerBase = Utils.randomInt(1, 10);
        const layerBand = Utils.randomInt(1, 10);

        // build its own patternFn
        const patternFn = (x, y) => {
            let t = layerBase + Math.floor(y / layerBand);
            let v = layerOp(x + y, y - x) % t;
            if (v < 0) v += t;
            return v % totalStates;
        };

        //set cell size per layer that isnt 1 which will always be the first divisor
        const cSize = divisors[ Utils.randomInt(1, divisors.length - 1) ];

        layers.push({
            cols: w/cSize,
            rows: h/cSize,
            xOffset: Utils.randomInt(0, 256),
            yOffset: Utils.randomInt(0, 256),
            patternFn,
            palette,
            numTransparentStates
        });
    }

    // 4) draw them all
    Renderer.drawLayers(layers, w, h);

    // // draw!
    // Renderer.drawBitGrid({
    //     cols: Math.floor(width / 64),
    //     rows: Math.floor(height / 64),
    //     xOffset: Utils.randomInt(0, 256),
    //     yOffset: Utils.randomInt(0, 256),
    //     patternFn: patternWithTrans,
    //     palette,               // array of hex strings
    //     width,
    //     height,
    //     numTransparentStates
    // });

    //never remove, for documenting purposes
    Utils.saveStamped(numStates, numTransparentStates, chosenPal.name);
}

//--------------------------------------------------------------------------------------

// new pattern fn that yields 0…totalStates-1
function patternWithTrans(x, y) {
    let t = baseModulus + floor(y / bandSize);
    let val = chosenOp(x + y, y - x) % t;
    if (val < 0) val += t;
    return val % totalStates;
}