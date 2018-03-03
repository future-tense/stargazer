
import language from '../../core/services/language.js';

export default class GlobalSettingsController {
	constructor() {
		this.language = language.getCurrentName();
	}
}
