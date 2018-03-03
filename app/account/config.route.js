
export default /* @ngInject */ function ($routeProvider) {

	$routeProvider
	.when('/page/send/', {
		template: '<send></send>'
	})

	.when('/page/recv', {
		template: '<receive></receive>'
	})

	.when('/page/transaction/:id', {
		template: '<transaction></transaction>'
	});
};
