
export default /* @ngInject */ function ($routeProvider) {

	$routeProvider
	.when('/', {
		template: '<overview></overview>'
	})
	.when('/page/home', {
		template: '<overview></overview>'
	})
	.when('/page/home/:accountId', {
		template: '<overview></overview>'
	});
};
