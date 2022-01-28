const fs = require('fs');
const frequencies = new Map();
        
fs
    .readFileSync('./contrib/unigram_freq.csv', 'utf8')
    .toString()
    .split('\n')
    .filter(row => {
        const columns = row.split(',');
        if (columns[1] === 'count') {
            return false;
        }
        const word = columns[0].toUpperCase();
        const weight = parseInt(columns[1], 10);
        frequencies.set(word, weight);
        return true;
    });

/**
* Calculate an arbitrary weight based on word frequency.
* @param {string} word - target
* @returns {int} numerical weight for sorting
*/
function calculateWeight(word) {
    return frequencies.get(word) || 0;
}

module.exports = calculateWeight;