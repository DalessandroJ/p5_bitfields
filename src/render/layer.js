import { randomInt } from "../sketch/utils.js";
import { OPS } from "./ops.js";

// returns ONE layer description
export function makeLayer(cfg, totalStates, divisors) {
    // random per-layer params
    const op = OPS[randomInt(0, OPS.length - 1)];
    const baseMod = randomInt(...cfg.baseModRange);
    const bandSize = randomInt(...cfg.bandSizeRange);
    const mode = 1; // 0 = radial, 1 = rows

    // cell size picked from grid divisors (but not 1 or gridSize)
    const cSize = divisors[randomInt(1, divisors.length - 2)];
    const cols = cfg.gridSize / cSize;
    const rows = cfg.gridSize / cSize;

    const xOffset = randomInt(...cfg.offsetRange);
    const yOffset = randomInt(...cfg.offsetRange);

    // calculate center in “cell space” after offset, in case we want to use radial mode
    const cx = cols / 2 + xOffset;
    const cy = rows / 2 + yOffset;

    // pattern function
    const patternFn = (x, y) => {
        const step = mode === 0
            ? Math.floor(Math.hypot(x - cx, y - cy) / bandSize) // radial
            : Math.floor(y / bandSize);                         // rows

        const t = baseMod + step;
        let val = op(x + y, y - x) % t;
        if (val < 0) val += t;
        return val % totalStates;
    };

    return {
        cols,
        rows,
        xOffset,
        yOffset,
        patternFn
    };
}