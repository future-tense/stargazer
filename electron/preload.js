/*
 decimal.js from bower isn't recognised properly
 under electron, so import it as a node module instead
 */

const decimal = require('decimal.js');

process.once('loaded', () => {
	global.Decimal = decimal;
});
