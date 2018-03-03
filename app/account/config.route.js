
export default /* @ngInject */ function ($routeProvider) {

	$routeProvider
	.when('/page/send/', {
		template: '<send></send>'
	})

	.when('/page/transaction/:id', {
		template: '<transaction></transaction>'
	});
};
