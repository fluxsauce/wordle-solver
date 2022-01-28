const { program } = require('commander');
const prompt = require('prompt');
const charWeight = require('./lib/char_freq');
const wordWeight = require('./lib/word_freq');
const dictionaryInit = require('./lib/dictionary');

program.version('1.0.0');
prompt.start();

const guesses = [];
// TODO: Set from commander.
const length = 5;

function loop() {
    prompt.get(['word', 'result'], (err, input) => {
        if (err) {
            process.exit(1);
        }
        guesses.push({ word: input.word, result: input.result });
        
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
        
        // Setup.
        const dictionary = dictionaryInit(length);
        
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

            if (word === 'PERKY') {
                console.log('negative: ', negative_pattern);
                console.log('exact: ', exact_pattern);
                console.log('close: ', close_pattern);
                console.log('close_contains: ', close_contains);    
            }
        
            return exact && close_not && close_contains && negative;
        });
        
        // Sort by word frequency.
        result.sort((a, b) => {
            return wordWeight(a) - wordWeight(b);
        });
        
        // Sort by character weight.
        // result.sort((a, b) => {
        //     return charWeight(a) - charWeight(b);
        // });
        
        // Uniqueness.
        result.sort((a, b) => {
            const uniqueA = [...new Set(a)].length;
            const uniqueB = [...new Set(b)].length;
        
            return uniqueA - uniqueB;
        });
        
        console.log(result.reverse());

        loop();
    });
}

loop();