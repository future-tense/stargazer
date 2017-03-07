/*
 decimal.js from bower isn't recognised properly
 under electron, so import it as a node module instead
 */

const _decimal = require('decimal.js');
process.once('loaded', () => {
	global.Decimal = _decimal;
});
