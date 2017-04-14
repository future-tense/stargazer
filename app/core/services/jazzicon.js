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

	function djb2Code(str){
		let hash = 5381;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = ((hash << 5) + hash) + char;
		}
		return hash;
	}
});
