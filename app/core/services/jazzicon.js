/* global angular, jazzicon, require */

import 'ionic-sdk/release/js/ionic.bundle';
import jazzicon from 'jazzicon';

angular.module('app.service.jazzicon', [])
.factory('Jazzicon', function () {
	'use strict';

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
