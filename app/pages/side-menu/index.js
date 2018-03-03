/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import SideMenuController from './side-menu.component';
import sideMenuTemplate from './side-menu.html';

export default angular.module('sideMenuPageModule', [])
.component('sideMenu', {
	controller: SideMenuController,
	controllerAs: 'vm',
	template: sideMenuTemplate
});

