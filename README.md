# wordle-solver
An optimized Wordle text puzzle solver.

```bash
npm i
```

```
node ./index.js --help
Usage: index [options]

An optimized Wordle text puzzle solver.

Options:
  -V, --version         output the version number
  -l, --length <chars>  length of word (default: 5)
  -d, --debug           display debugging
  -m, --method <type>   methodolgy (choices: "char", "word", default: "word")
  -h, --help            display help for command


For each guess, provide a word and the result.

- Word: A-Z letters only, capitalized or lowercase.
- Result: Use the following format - Y (green match), N (grey miss), ? (yellow close)

For example:

  prompt: word:  ABOUT
  prompt: result:  NN??N

If you made a mistake, type UNDO for the word with no result, and the last guess will be removed.

To see the most likely word without entering any guess, provide empty input for both the word and result.

The program exits when the puzzle is solved (result: YYYYY). To exit without completing, press Ctrl+C.
```

Citiations:

- https://www.kaggle.com/rtatman/english-word-frequency
- https://www3.nd.edu/~busiforc/handouts/cryptography/letterfrequencies.html
- https://boardgames.stackexchange.com/questions/38366/latest-collins-scrabble-words-list-in-text-file
