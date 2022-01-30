const prompt = require('prompt');
const charWeight = require('./lib/char_freq');
const wordWeight = require('./lib/word_freq');
const dictionaryInit = require('./lib/dictionary');
const options = require('./lib/program');

const length = parseInt(options.length, 10);
console.log(`Word length: ${length}`);
console.log(`Method: ${options.method}`);

const guesses = [];
let guessCount = 1;

prompt.start();

function loop() {
  console.log();
  console.log(`Guess #${guessCount}`);

  prompt.get(['word', 'result'], (err, input) => {
    if (err) {
      process.exit(1);
    }

    // Normalize input.
    const word = input.word.toUpperCase();
    const result = input.result.toUpperCase();

    // We make mistakes.
    if (input.word === 'undo') {
      if (guesses.length > 0) {
        guesses.pop();
        guessCount -= 1;
      }

      return loop();
    }

    // Start validation.
    const errors = [];

    // Validation - word.
    const validateWordPattern = new RegExp(`^$|^[A-Z]{${length}}$`);
    const validateWordResult = validateWordPattern.test(word);
    if (!validateWordResult) {
      errors.push(`The word must only contain the letters A through Z and be ${length} character(s) long`);
    }

    // Validation - result.
    const validateResultPattern = new RegExp(`^$|[YN?]{${length}}$`);
    const validateResultResult = validateResultPattern.test(result);
    if (!validateResultResult) {
      errors.push(`The result must only contain Y, N or ? and be ${length} character(s) long`);
    }

    // Validation - debug.
    if (options.debug) {
      console.debug('Word Validation', validateWordPattern, validateResultResult);
      console.debug('Result Validation', validateResultPattern, validateResultResult);
    }

    // Validation - bail if incorrect.
    if (errors.length > 0) {
      errors.forEach((error) => console.error(`  Error: ${error}`));
      return loop();
    }

    // Success!
    if (input.result === 'Y'.repeat(length)) {
      console.log();
      console.log(`Success in ${guessCount} guess(es)!`);
      process.exit(0);
    }

    if (input.word !== '') {
      guessCount += 1;
      guesses.push({ word, result });
    }

    // Input.
    const exact = [];
    const close = [];
    const not = [];

    guesses.forEach((guess) => {
      guess.result.split('').forEach((guessResult, position) => {
        if (guessResult === 'N') {
          not.push(guess.word[position]);
        } else if (guessResult === '?') {
          close.push({ letter: guess.word[position], position });
        } else {
          exact.push({ letter: guess.word[position], position });
        }
      });
    });

    // Setup.
    const dictionary = dictionaryInit(length);

    // Exact match.
    let exactPattern = '.'.repeat(length);
    exact.forEach((letterPos) => {
      exactPattern = exactPattern.substring(0, letterPos.position)
        + letterPos.letter
        + exactPattern.substring(letterPos.position + 1);
    });

    // Negative match.
    const nowhere = not.filter((letter) => !close.some((e) => e.letter === letter)
        && !exact.some((e) => e.letter === letter));
    const negativePattern = `^[^${nowhere.join('')}]*$`;

    // Close match.
    const closeArray = Array(length).fill('');
    for (let index = 0; index < length; index += 1) {
      close.forEach((letterPos) => {
        if (letterPos.position === index) {
          closeArray[index] += letterPos.letter;
        }
      });
    }

    let closePattern = '';
    closeArray.forEach((element) => {
      if (element === '') {
        closePattern += '.';
      } else {
        closePattern += `[^${element}]`;
      }
    });
    closePattern = `^${closePattern}$`;

    const candidates = dictionary.filter((candidateWord) => {
      const negativeResult = candidateWord.match(negativePattern);

      const exactMatchResult = candidateWord.match(exactPattern);
      const closeNot = candidateWord.match(closePattern);
      let closeContains = true;

      if (close.length > 0) {
        close.forEach((letterPos) => {
          if (candidateWord.indexOf(letterPos.letter) === -1) {
            closeContains = false;
          }
        });
      }

      if (options.debug) {
        console.debug('negativePattern: ', negativePattern);
        console.debug('exactPattern: ', exactPattern);
        console.debug('close: ', close);
        console.debug('closePattern: ', closePattern);
        console.debug('closeNot: ', closeNot);
        console.debug('closeContains: ', closeContains);
      }

      return exactMatchResult && closeNot && closeContains && negativeResult;
    });

    // Sort by word frequency.
    if (options.method === 'word') {
      candidates.sort((a, b) => wordWeight(a) - wordWeight(b));
    }

    // Sort by character weight.
    if (options.method === 'char') {
      candidates.sort((a, b) => charWeight(a) - charWeight(b));
    }

    // Uniqueness.
    candidates.sort((a, b) => {
      const uniqueA = [...new Set(a)].length;
      const uniqueB = [...new Set(b)].length;

      return uniqueA - uniqueB;
    });

    console.log(candidates.reverse());

    return loop();
  });
}

loop();
