/* global angular, require */

angular.module('app')
.factory('Jazzicon', function () {
	'use strict';

	const jazzicon = require('jazzicon');

	return {
		render: render
	};

	function render(seed) {
		return jazzicon(40, djb2Code(seed));
	}

	function djb2Code(str) {
		return [...str].map(char => char.charCodeAt(0))
		.reduce((hash, item) => (hash << 5) + hash + item, 5381);
	}
});
