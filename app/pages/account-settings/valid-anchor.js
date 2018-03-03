
export default /* @ngInject */ function ($q, Anchors, Destination) {

	function any(list) {

		let counter = 0;
		function resolve(res) {
			counter += 1;
			return res;
		}

		function reject(err) {
			return err;
		}

		return $q.all(list.map(item => item.then(resolve, reject)))
		.then(res => {
			if (counter >= 1) {
				return res;
			} else {
				return $q.reject();
			}
		});
	}

	return {
		require: 'ngModel',
		link: function (scope, element, attributes, ngModel) {
			ngModel.$asyncValidators.validAnchor = function (name) {
				return any([
					Anchors.lookup(name),
					Destination.lookup(name)
				]);
			};
		}
	};
}
