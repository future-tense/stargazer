angular.module('app')
.directive('valBubble', function (formHelper) {
	'use strict';
	return {
		require: 'ngModel',
		restrict: "A",
		link: function (scope, element, attr, ctrl) {

			if (!attr.name) {
				throw "valBubble must be set on an input element that has a 'name' attribute";
			}

			var currentForm = formHelper.getCurrentForm(scope);
			if (!currentForm || !currentForm.$name) {
				throw "valBubble requires that a name is assigned to the ng-form containing the validated input";
			}

			//watch the current form's validation for the current field name
			scope.$watch(currentForm.$name + "." + ctrl.$name + ".$valid", function (isValid, lastValue) {
				if (isValid !== undefined) {
					//emit an event upwards
					scope.$emit("valBubble", {
						isValid: isValid,       // if the field is valid
						element: element,       // the element that the validation applies to
						expression: this.exp,   // the expression that was watched to check validity
						scope: scope,           // the current scope
						ctrl: ctrl              // the current controller
					});
				}
			});
		}
	};
});
