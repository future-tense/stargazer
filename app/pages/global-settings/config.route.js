
export default /* @ngInject */ function ($routeProvider) {

	$routeProvider
	.when('/page/global-settings/about', {
		template: '<about-app></about-app>'
	})
	.when('/page/global-settings/contacts', {
		template: '<contact-list></contact-list>'
	})
	.when('/page/global-settings/contact/:name', {
		template: '<edit-contact></edit-contact>'
	})
	.when('/page/global-settings/language', {
		template: '<language></language>'
	})
	.when('/page/global-settings/', {
		template: '<global-settings></global-settings>'
	});
};
