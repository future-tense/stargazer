
import centaurus from './centaurus.js';

export default function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attributes, ngModel) {

			ngModel.$validators.validPassword = function (modelValue) {
				if (modelValue) {
					return centaurus.isValidPassword(attributes.cipher, modelValue);
				} else {
					return false;
				}
			};
		}
	};
}
