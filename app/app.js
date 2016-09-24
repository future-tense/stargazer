/* global nw, angular, console, require, Peer, StellarSdk */

angular.module('app', [
	'ngRoute',
	'ionic'
], function ($compileProvider) {
	'use strict';
	$compileProvider.aHrefSanitizationWhitelist(/^\s*((https?|ftp|mailto|file|chrome-extension|tel):)|#/);
})
.run(function ($rootScope, $window) {
	'use strict';
	$rootScope.goBack = function() {
		$window.history.back();
	};
})
.run(function (platformInfo) {
	'use strict';

	if (platformInfo.isNW) {

//		nw.Window.get().showDevTools();

		// Load native UI library
		var gui = require('nw.gui');

		// Create menu
		var menu = new gui.Menu({
			type: 'menubar'
		});

		// Append Menu to Window
		gui.Window.get().menu = menu;

		// create MacBuiltin
		try {
			menu.createMacBuiltin('Sample App', {
				hideEdit: false,
				hideWindow: true
			});
		} catch (e) {}
	}
});
