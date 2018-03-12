
import language from '../../core/services/language.js';
import storage from '../../core/services/storage';

export default class GlobalSettingsController {
	constructor() {
		this.language = language.getCurrentName();
		this.advanced = storage.getItem('advanced');
	}

	toggleAdvanced() {
		storage.setItem('advanced', this.advanced);
	}
}
