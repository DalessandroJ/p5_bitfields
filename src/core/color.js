/* Colour utilities */
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
