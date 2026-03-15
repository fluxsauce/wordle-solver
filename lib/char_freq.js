// https://norvig.com/mayzner.html
const frequencyWeighting = new Map()
	.set("E", 12.49)
	.set("T", 9.28)
	.set("A", 8.04)
	.set("O", 7.64)
	.set("I", 7.57)
	.set("N", 7.23)
	.set("S", 6.51)
	.set("R", 6.28)
	.set("H", 5.05)
	.set("L", 4.07)
	.set("D", 3.82)
	.set("C", 3.34)
	.set("U", 2.73)
	.set("M", 2.51)
	.set("F", 2.4)
	.set("P", 2.14)
	.set("G", 1.87)
	.set("W", 1.68)
	.set("Y", 1.66)
	.set("B", 1.48)
	.set("V", 1.05)
	.set("K", 0.54)
	.set("X", 0.23)
	.set("J", 0.16)
	.set("Q", 0.12)
	.set("Z", 0.09);

/**
 * Calculate an arbitrary weight based on character frequency.
 * @param {string} word - target
 * @returns {int} numerical weight for sorting
 */
function calculateWeight(word) {
	return word
		.split("")
		.map((letter) => frequencyWeighting.get(letter))
		.reduce((partialSum, a) => partialSum + a, 0);
}

module.exports = calculateWeight;
