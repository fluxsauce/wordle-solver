const { program, Option } = require('commander');
const prompt = require('prompt');
const charWeight = require('./lib/char_freq');
const wordWeight = require('./lib/word_freq');
const dictionaryInit = require('./lib/dictionary');

program
    .version('1.0.0')
    .option('-l, --length <chars>', 'length of word', 5)
    .option('-d, --debug', 'display debugging')
    .addOption(new Option('-m, --method <type>', 'methodolgy').choices(['char', 'word']).default('word'))
    .showHelpAfterError();
program.parse();
const options = program.opts();

const length = parseInt(options.length, 10);
console.log(`Word length: ${length}`)
console.log(`Method: ${options.method}`);

const guesses = [];
let guess_count = 0;

prompt.start();

function loop() {
    console.log();
    console.log(`Guess count: ${guess_count}`);

    prompt.get(['word', 'result'], (err, input) => {
        if (err) {
            process.exit(1);
        }
        if (input.word === 'undo') {
            guesses.pop();
            guess_count--;
            return loop();
        }

        input.word = input.word.toUpperCase();
        input.result = input.result.toUpperCase();

        if (input.result === 'Y'.repeat(length)) {
            console.log(`${guess_count} guess(es)`);
            process.exit(0);
        }

        if (input.word !== '') {
            guess_count++;
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
        let exact_pattern = '.'.repeat(length);
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
                close_pattern += '[^' + element + ']';
            }
        });
        close_pattern = `^${close_pattern}$`
        
        const result = dictionary.filter(word => {
            const negative = word.match(negative_pattern);
            
            const exact = word.match(exact_pattern);
            const close_not = word.match(close_pattern);
            let close_contains = true;

            if (close.length > 0) {
                close.forEach(letter_pos => {
                    if (word.indexOf(letter_pos.letter) === -1) {
                        close_contains = false;
                    }
                });
            }

            if (options.debug) {
                console.log('negative_pattern: ', negative_pattern);
                console.log('exact_pattern: ', exact_pattern);
                console.log('close: ', close);
                console.log('close_pattern: ', close_pattern);
                console.log('close_not: ', close_not);
                console.log('close_contains: ', close_contains);    
            }
        
            return exact && close_not && close_contains && negative;
        });
        
        // Sort by word frequency.
        if (options.method === 'word') {
            result.sort((a, b) => {
                return wordWeight(a) - wordWeight(b);
            });
        }
        
        // Sort by character weight.
        if (options.method === 'char') {
            result.sort((a, b) => {
                return charWeight(a) - charWeight(b);
            });
        }
        
        // Uniqueness.
        result.sort((a, b) => {
            const uniqueA = [...new Set(a)].length;
            const uniqueB = [...new Set(b)].length;
        
            return uniqueA - uniqueB;
        });
        
        console.log(result.reverse());

        return loop();
    });
}

loop();