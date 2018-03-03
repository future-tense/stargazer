
export default /* @ngInject */ function ($routeProvider) {

	$routeProvider
		.when('/page/add-account', {
			template: '<add-account></add-account>'
		})
		.when('/page/add-account/import-account/:data?', {
			template: '<import-account></import-account>'
		})
		.when('/page/import-centaurus/:data', {
			template: '<import-centaurus></import-centaurus>'
		})
		.when('/page/add-account/create-personal', {
			template: '<create-personal></create-personal>'
		})
		.when('/page/add-account/create-shared', {
			template: '<create-shared></create-shared>'
		});
};
