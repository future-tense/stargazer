/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

class AboutAppController {
	constructor(platformInfo) {
		this.isAndroid = platformInfo.isAndroid;
	}
}

angular.module('app.component.about-app', [])
.component('aboutApp', {
	controller: AboutAppController,
	controllerAs: 'vm',
	templateUrl: 'app/side-menu/components/about-app.html'
});
