// https://www3.nd.edu/~busiforc/handouts/cryptography/letterfrequencies.html
const frequencyWeighting = new Map()
    .set('E', 56.88)
    .set('A', 43.31)
    .set('R', 38.64)
    .set('I', 38.45)
    .set('O', 36.51)
    .set('T', 35.43)
    .set('N', 33.92)
    .set('S', 29.23)
    .set('L', 27.98)
    .set('C', 23.13)
    .set('U', 18.51)
    .set('D', 17.25)
    .set('P', 16.14)
    .set('M', 15.36)
    .set('H', 15.31)
    .set('G', 12.59)
    .set('B', 10.56)
    .set('F', 9.24)
    .set('Y', 9.06)
    .set('W', 6.57)
    .set('K', 5.61)
    .set('V', 5.13)
    .set('X', 1.48)
    .set('Z', 1.36)
    .set('J', 1)
    .set('Q', .99);

/**
* Calculate an arbitrary weight based on character frequency.
* @param {string} word - target
* @returns {int} numerical weight for sorting
*/
function calculateWeight(word) {
    return word
        .split('')
        .map(letter => frequencyWeighting.get(letter))
        .reduce((partialSum, a) => partialSum + a, 0);
}

module.exports = calculateWeight;