/* global angular */

import platformInfo from '../../core/services/platform-info.js';

export default class AboutAppController {
	constructor() {
		this.isAndroid = platformInfo.isAndroid;
	}
}
