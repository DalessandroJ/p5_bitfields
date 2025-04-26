const Utils = {
    /**
 * Returns the greatest common divisor of a and b.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
    gcd(a, b) {
        return b === 0 ? a : Utils.gcd(b, a % b);
    },

    /**
     * Returns a sorted array of all common divisors of a and b.
     * @param {number} a
     * @param {number} b
     * @returns {number[]}
     */
    commonDivisors(a, b) {
        const g = Utils.gcd(Math.abs(a), Math.abs(b));
        const divs = [];
        for (let i = 1; i * i <= g; i++) {
            if (g % i === 0) {
                divs.push(i);
                if (i !== g / i) divs.push(g / i);
            }
        }
        return divs.sort((x, y) => x - y);
    },

    /**
       * Returns a random integer between min and max (inclusive).
       * Works with negative bounds and swaps automatically if min > max.
       * @param {number} min
       * @param {number} max
       * @returns {number}
       */
    randomInt(min, max) {
        if (min > max) [min, max] = [max, min];
        const lo = Math.ceil(min);
        const hi = Math.floor(max);
        return Math.floor(Math.random() * (hi - lo + 1)) + lo;
    },

    /**
     * Returns a random float between min (inclusive) and max (exclusive).
     * Works with negative bounds and swaps automatically if min > max.
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    randomFloat(min, max) {
        if (min > max) [min, max] = [max, min];
        return Math.random() * (max - min) + min;
    },


    /**
     * Logs an info message to the console.
     * @param {string} msg - Message to log
     */
    info: (msg) => console.log(`[INFO] ${msg}`),

    /**
     * Logs an error message to the console.
     * @param {string} msg - Message to log
     */
    error: (msg) => console.error(`[ERROR] ${msg}`),

    /**
     * Saves the canvas with a timestamped filename.
     */
    saveStamped: (numStates, numTransparentStates, paletteName) => {
        const timestamp = `${year()}${Utils.pad(month(), 2)}${Utils.pad(day(), 2)}_` +
            `${Utils.pad(hour(), 2)}${Utils.pad(minute(), 2)}${Utils.pad(second(), 2)}`;
        saveCanvas(`${timestamp}_${numStates}s_${numTransparentStates}t_${paletteName}`, 'png');
    },

    /**
     * Pads a number to the specified number of digits.
     * @param {number} num - Number to pad
     * @param {number} digits - Number of digits
     * @returns {string} Padded string
     */
    pad: (num, digits) => String(num).padStart(digits, '0'),
};