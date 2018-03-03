
export default /* @ngInject */ function ($routeProvider) {

	$routeProvider
	.when('/side-menu/about', {
		template: '<about-app></about-app>'
	})
	.when('/side-menu/contacts', {
		template: '<contact-list></contact-list>'
	})
	.when('/side-menu/contact/:name', {
		template: '<edit-contact></edit-contact>'
	})
	.when('/side-menu/language', {
		template: '<language></language>'
	})
	.when('/side-menu/settings', {
		template: '<global-settings></global-settings>'
	});
};
