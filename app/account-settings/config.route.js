
export default function ($routeProvider) {
	$routeProvider
	.when('/account-settings', {
		template: '<account-settings></account-settings>'
	})
	.when('/account-settings/advanced', {
		template: '<advanced-settings></advanced-settings>'
	})
	.when('/account-settings/alias', {
		template: '<account-alias></account-alias>'
	})
	.when('/account-settings/delete', {
		template: '<delete-account></delete-account>'
	})
	.when('/account-settings/export', {
		template: '<export-account></export-account>'
	})
	.when('/account-settings/federation', {
		template: '<account-federation></account-federation>'
	})
	.when('/account-settings/inflation', {
		template: '<inflation-destination></inflation-destination>'
	})
	.when('/account-settings/signers', {
		template: '<account-signers></account-signers>'
	})
	.when('/account-settings/trustlines', {
		template: '<account-trustlines></account-trustlines>'
	});
};
