/* Misc helpers */
export const info = msg => console.log(`[INFO]  ${msg}`);
export const error = msg => console.error(`[ERROR] ${msg}`);

export const pad = (num, digits) => String(num).padStart(digits, '0');

export function saveStamped(numStates, numTransparent, paletteName) {
    const ts = `${year()}${pad(month(), 2)}${pad(day(), 2)}_${pad(hour(), 2)}${pad(minute(), 2)}${pad(second(), 2)}`;
    saveCanvas(`${ts}_${numStates}s_${numTransparent}t_${paletteName}`, 'png');
}

//get the darkest and lightest color from an array of hex color strings
export function minMaxLum(colors) {
    let dark = colors[0], light = colors[0];
    let minL = Infinity, maxL = -Infinity;
    for (const raw of colors) {
        const hex = raw.replace(/^#/, '');
        const v = parseInt(hex, 16);
        const r = (v >> 16) & 0xff;
        const g = (v >> 8) & 0xff;
        const b = v & 0xff;
        const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        if (L < minL) { minL = L; dark = raw; }
        if (L > maxL) { maxL = L; light = raw; }
    }
    return { darkest: dark, lightest: light };
}