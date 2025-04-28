import { randomInt } from "../core/math.js";
import { OPS } from "./ops.js";

/**
 * Factory → returns ONE layer description (pure data, no p5 calls)
 */
export function makeLayer(cfg, totalStates, divisors) {
    // ── random per-layer params ─────────────────────────────
    const op = OPS[randomInt(0, OPS.length - 1)];
    const baseMod  = randomInt(...cfg.baseModRange);
    const bandSize = randomInt(...cfg.bandSizeRange);
    const mode = 1;                     // 0 = radial, 1 = rows

    // cell size picked from grid divisors (skip 1 and gridSize)
    const cSize = divisors[randomInt(1, divisors.length - 2)];
    const cols = cfg.gridSize / cSize;
    const rows = cfg.gridSize / cSize;

    const xOffset  = randomInt(...cfg.offsetRange);
    const yOffset  = randomInt(...cfg.offsetRange);

    // calcualte center in “cell space” after offset, in case we want to use radial mode
    const cx = cols / 2 + xOffset;
    const cy = rows / 2 + yOffset;

    // ── pure pattern function ───────────────────────────────
    const patternFn = (x, y) => {
        const step = mode === 0
            ? Math.floor(Math.hypot(x - cx, y - cy) / bandSize)       // radial
            : Math.floor(y / bandSize);                               // rows

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
