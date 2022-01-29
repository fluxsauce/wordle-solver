const fs = require('fs');

const dictionary = fs
  .readFileSync('./contrib/collins_scrabble.txt', 'utf8')
  .toString()
  .split('\n');

module.exports = (length) => dictionary.filter((word) => word.length === length);
