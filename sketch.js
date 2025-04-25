let masterPalettes;
let palette;
let numStates;

const OPS = [
    (a, b) => a & b,   // AND
    (a, b) => a ^ b,   // XOR
    (a, b) => a | b,   // OR
    //(a, b) => a << b,  //left shift
    //(a, b) => a >> b,  //right shift
];
const chosenOp = OPS[Math.floor(Math.random() * OPS.length)];
const baseModulus = Math.floor(Math.random() * 10) + 1;          // starting t
const bandSize = Math.floor(Math.random() * 10) + 1;            // increase t every 10 rows

//--------------------------------------------------------------------------------------

function setup() {
    noLoop();

    //preload() dont work so just do it ourselves
    loadJSON(
        'data/masterPalettes.json',
        data => {
            masterPalettes = data;

            const w = windowWidth;
            const h = w * (5 / 4);
            createCanvas(w, h);
            pixelDensity(1);

            // pick how many states (colors) we want: 2…maxStates inclusive
            const maxStates = 4;
            numStates = Math.floor(Math.random() * (maxStates - 1)) + 2;

            // grab your palette
            const listOfPalettes = masterPalettes[numStates];
            const chosenPal = random(listOfPalettes);
            console.log(`${numStates} states | Chosen palette: ${chosenPal.name}`);
            palette = chosenPal.colors;

            // draw!
            drawBitGrid({
                cols: Math.floor(width / 4),
                rows: Math.floor(height / 4),
                xOffset: Math.floor(Math.random() * (256 - -256 + 1)) + -256,
                yOffset: Math.floor(Math.random() * (256 - -256 + 1)) + -256,
                patternFn: bitPattern
            });

            //never remove, for documenting purposes
            saveStamped();
        },
        err => {
            console.error('masterPalettes.json failed to load:', err);
        }
    );
}

//--------------------------------------------------------------------------------------

function bitPattern(x, y) {

    let t = baseModulus + floor(y / bandSize);
    let val = chosenOp(x + y, y - x) % t;
    if (val < 0) val += t;
    return val % numStates;

    // 1) Classic sum parity (checkerboard)
    // return ((x + y) % numStates);

    // 2) AND‑mix: parity of (x+y) AND (y–x)
    //return (((x + y) & (y - x)) % numStates);

    // 3) XOR‑mix: parity of (x+y) XOR (y–x)
    // return (((x + y) ^ (y - x)) % numStates);

    // 4) Gradient modulus: parity of (x+y) mod dynamic m = 2 + floor(y/10)
    // let m = 2 + Math.floor(y / 10);
    // return ((x + y) % m) % numStates;

    // 5) Scaled sum vs. difference (from Script 2 R code)
    //return ((Math.floor((2/3) * (x + y)) & (y - Math.abs(x + y))) % numStates);

    // 6) Multiplicative shift: parity of (x*y >> 3)
    // return (((x * y) >> 6) % numStates);

    // 7) Bit‑rotate XOR: rotate x right by 5 bits, XOR with y
    // function rotr(v, s) {
    //   return ((v >>> s) | (v << (32 - s))) >>> 0;
    // }
    // return ((rotr(x, 5) ^ y) % numStates);

    // 8) Mask‑extract & combine: parity of bit 3 of x XOR bit 4 of y
    // return (((x >> 3) & 1) ^ ((y >> 4) % numStates));

    // 9) Nested modulo: parity of (x XOR y) mod 3
    //return (((x ^ y) % 5) % numStates);

    // 10) Randomized operator per cell
    // const ops = [
    //     (a, b) => a & b, // AND
    //     (a, b) => a ^ b, // XOR
    //     (a, b) => a | b  // OR
    // ];
    // let fn = ops[((x + y)) % ops.length];
    // return (fn(x, y) % numStates);

    // ————————————————————————————
    // Default fallback:
    //return ((x + y) & 1);
}

//–– Draws an M×N grid by painting pixels ––
function drawBitGrid({ cols, rows, xOffset, yOffset, patternFn }) {
    const cellW = width / cols;
    const cellH = height / rows;
    loadPixels();

    for (let py = 0; py < height; py++) {
        const row = floor(py / cellH);
        for (let px = 0; px < width; px++) {
            const col = floor(px / cellW);
            const v = patternFn(col + xOffset, row + yOffset); // 0…numStates-1

            // parse the hex color for this state
            const hex = palette[v];
            const iv = parseInt(hex, 16);
            const idx = 4 * (px + py * width);
            pixels[idx] = (iv >> 16) & 0xFF; // R
            pixels[idx + 1] = (iv >> 8) & 0xFF; // G
            pixels[idx + 2] = iv & 0xFF; // B
            pixels[idx + 3] = 255;              // A
        }
    }
    updatePixels();
}



// save image with timestamp filename
function saveStamped() {

    // helper to return YYYYMMDD_HHMMSS
    function getTimestamp() {
        const Y = year();
        const M = nf(month(), 2); // pad to 2 digits
        const D = nf(day(), 2);
        const h = nf(hour(), 2);
        const m = nf(minute(), 2);
        const s = nf(second(), 2);
        return `${Y}${M}${D}_${h}${m}${s}`;
    }

    const filename = `bitfield_${getTimestamp()}`;
    saveCanvas(filename, 'png');
}

