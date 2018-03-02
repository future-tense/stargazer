/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import platformInfo from '../../core/services/platform-info.js';

import aboutAppTemplate from './about-app.html';

class AboutAppController {
	constructor() {
		this.isAndroid = platformInfo.isAndroid;
	}
}

angular.module('app.component.about-app', [])
.component('aboutApp', {
	controller: AboutAppController,
	controllerAs: 'vm',
	template: aboutAppTemplate
});
