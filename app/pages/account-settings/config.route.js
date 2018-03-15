
export default /* @ngInject */ function ($routeProvider) {

	$routeProvider
	.when('/page/account-settings/advanced', {
		template: '<advanced-settings></advanced-settings>'
	})
	.when('/page/account-settings/alias', {
		template: '<account-alias></account-alias>'
	})
	.when('/page/account-settings/delete', {
		template: '<delete-account></delete-account>'
	})
	.when('/page/account-settings/close', {
		template: '<close-account></close-account>'
	})
	.when('/page/account-settings/export', {
		template: '<export-account></export-account>'
	})
	.when('/page/account-settings/inflation', {
		template: '<inflation-destination></inflation-destination>'
	})
	.when('/page/account-settings/signers', {
		template: '<account-signers></account-signers>'
	})
	.when('/page/account-settings/trustlines', {
		template: '<account-trustlines></account-trustlines>'
	})
	.when('/page/account-settings/recovery-phrase', {
		template: '<recovery-phrase></recovery-phrase>'
	})
	.when('/page/account-settings', {
		template: '<account-settings></account-settings>'
	});
};
