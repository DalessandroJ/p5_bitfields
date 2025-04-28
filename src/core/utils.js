/* Misc helpers */
export const info = msg => console.log(`[INFO]  ${msg}`);
export const error = msg => console.error(`[ERROR] ${msg}`);

export const pad = (num, digits) => String(num).padStart(digits, '0');

export function saveStamped(numStates, numTransparent, paletteName) {
    const ts = `${year()}${pad(month(), 2)}${pad(day(), 2)}_${pad(hour(), 2)}${pad(minute(), 2)}${pad(second(), 2)}`;
    saveCanvas(`${ts}_${numStates}s_${numTransparent}t_${paletteName}`, 'png');
}