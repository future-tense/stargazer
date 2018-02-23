
export default /* @ngInject */ function ($routeProvider) {

	$routeProvider
	.when('/', {
		template: '<overview></overview>'
	})

	.when('/account/overview', {
		template: '<overview></overview>'
	})

	.when('/account/send/', {
		template: '<send></send>'
	})

	.when('/account/recv', {
		template: '<receive></receive>'
	})

	.when('/account/:accountId', {
		template: '<overview></overview>'
	})

	.when('/account/transaction/:id', {
		template: '<transaction></transaction>'
	});
};
