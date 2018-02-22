/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.service.reviewer', [])
.factory('Reviewer', function (Modal) {
	'use strict';

	return {
		review:	review
	};

	function review(context) {
		const data = {
			context: context
		};
		return Modal.show('app/core/modals/review-submit.html', data);
	}
});
