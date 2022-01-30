const { program, Option, InvalidArgumentError } = require('commander');

program
  .version('1.0.0')
  .description('An over-engineered Wordle text puzzle solver.')
  .addOption(new Option('-l, --length <number>', 'length of word')
    .default(5)
    .argParser((value) => {
      const parsedValue = parseInt(value, 10);
      if (Number.isNaN(parsedValue) || parsedValue < 1 || parsedValue > 15) {
        throw new InvalidArgumentError('Not a positive integer between 1 and 15.');
      }
      return parsedValue;
    }))
  .option('-d, --debug', 'display debugging')
  .addOption(new Option('-m, --method <type>', 'methodolgy')
    .choices(['char', 'word'])
    .default('word'))
  .showHelpAfterError()
  .addHelpText('after', `
For each guess, provide a word and the result.

- Word: A-Z letters only, capitalized or lowercase.
- Result: Use the following format - Y (green match), N (grey miss), ? (yellow close)

For example:

  prompt: word:  ABOUT
  prompt: result:  NN??N

If you made a mistake, type UNDO for the word with no result, and the last guess will be removed.

To see the most likely word without entering any guess, provide empty input for both the word and result.

The program exits when the puzzle is solved (result: YYYYY). To exit without completing, press Ctrl+C.`);
program.parse();

module.exports = program.opts();
