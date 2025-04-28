/* Number helpers */
export function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

export function commonDivisors(a, b) {
    const g = gcd(Math.abs(a), Math.abs(b));
    const divs = [];
    for (let i = 1; i * i <= g; i++) {
        if (g % i === 0) {
            divs.push(i);
            if (i !== g / i) divs.push(g / i);
        }
    }
    return divs.sort((x, y) => x - y);
}

export function randomInt(min, max) {
    if (min > max) [min, max] = [max, min];
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

export function randomFloat(min, max) {
    if (min > max) [min, max] = [max, min];
    return Math.random() * (max - min) + min;
}
