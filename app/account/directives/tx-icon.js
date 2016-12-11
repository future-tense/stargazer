/* global angular  */

angular.module('app')
.directive('txIcon', function () {
	'use strict';

	var html = {
		'send':	'<div class="circle circle-red"><i class="icon ion-ios-upload-outline"></i></div>',
		'recv':	'<div class="circle circle-green"><i class="icon ion-ios-download-outline"></i></div>',
		'trade':'<div class="circle circle-blue"><i class="fa fa-exchange"></i></div>'
	};

	function link(scope, element, attrs) {
		scope.$watch('type', function () {
			element[0].innerHTML = html[attrs.type];
		});
	}

 	return {
		restrict: 'E',
		scope: {
			type: '@'
		},
		link: link
	};
});
