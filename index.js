const fs = require('fs');

const guesses = [
   { word: 'ABOUT', result: 'NNNNN' },
   { word: 'WHICH', result: 'NNNNN' },
   { word: 'LEVEL', result: 'NYNNN' }
];

// Input.
let exact = [];
let close = [];
let not = [];

guesses.forEach(guess => {
    guess.result.split('').forEach((result, position) => {
        if (result === 'N') {
            not.push(guess.word[position]);
        } else if (result === '?') {
            close.push({ letter: guess.word[position], position });
        } else {
            exact.push({ letter: guess.word[position], position });
        }
    });
});

const length = 5;

// Setup.
const dictionary = fs
    .readFileSync('./dictionary.txt', 'utf8')
    .toString()
    .split('\n')
    .filter(word => word.length === length);

const frequencies = new Map();

fs
    .readFileSync('./unigram_freq.csv', 'utf8')
    .toString()
    .split('\n')
    .filter(row => {
        const columns = row.split(',');
        if (columns[1] === 'count') {
            return false;
        }
        if (columns[0].length !== 5) {
            return false;
        }
        const word = columns[0].toUpperCase();
        const weight = parseInt(columns[1], 10);
        frequencies.set(word, weight);
        return true;
    });

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

// Exact match.
let exact_pattern = '.....';
exact.forEach(letter_pos => {
    exact_pattern = exact_pattern.substring(0, letter_pos.position)
        + letter_pos.letter
        + exact_pattern.substring(letter_pos.position + 1);
});

// Negative match.
const nowhere = not.filter(letter => {
    return !close.some(e => e.letter === letter) && !exact.some(e => e.letter === letter);
});
const negative_pattern = '^[^' + nowhere.join('') + ']*$';

// Close match.
close_array = Array(length).fill('');
for (let index = 0; index < length; index++) {
    close.forEach(letter_pos => {
        if (letter_pos.position === index) {
            close_array[index] += letter_pos.letter;
        }
    });
}

let close_pattern = '';
close_array.forEach(element => {
    if (element === '') {
        close_pattern += '.';
    } else {
        close_pattern += '[' + element + ']';
    }
});

const result = dictionary.filter(word => {
    const negative = word.match(negative_pattern);
    
    const exact = word.match(exact_pattern);
    const close_not = word.match(close_pattern);
    let close_contains = true;
    
    if (close.length > 0) {
        close_contains = word.match(close.map(letter_pos => `(?=.*${letter_pos.letter})`).join('')); 
    }

    return exact && close_not && close_contains && negative;
});

// Sort by word frequency.
result.sort((a, b) => {
    const freqA = frequencies.get(a) || 0;
    const freqB = frequencies.get(b) || 0;

    return freqA - freqB;
});

// Sort by character weight.
// result.sort((a, b) => {
//     const weightA = calculateWeight(a);
//     const weightB = calculateWeight(b);
    
//     return weightA - weightB;
// });

// Uniqueness.
result.sort((a, b) => {
    const uniqueA = [...new Set(a)].length;
    const uniqueB = [...new Set(b)].length;

    return uniqueA - uniqueB;
});

console.log(result.reverse());