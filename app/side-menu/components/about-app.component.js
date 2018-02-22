/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import platformInfo from '../../core/services/platform-info.js';

class AboutAppController {
	constructor() {
		this.isAndroid = platformInfo.isAndroid;
	}
}

angular.module('app.component.about-app', [])
.component('aboutApp', {
	controller: AboutAppController,
	controllerAs: 'vm',
	templateUrl: 'app/side-menu/components/about-app.html'
});
