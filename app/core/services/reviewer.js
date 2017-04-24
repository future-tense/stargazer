/* global angular */

angular.module('app')
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
