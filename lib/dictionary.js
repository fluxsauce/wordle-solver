const fs = require("fs");

const dictionary = fs
	.readFileSync("./contrib/twl06.txt", "utf8")
	.toString()
	.toUpperCase()
	.split("\n");

module.exports = (length) =>
	dictionary.filter((word) => word.length === length);
