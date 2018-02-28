/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import reviewService from './reviewer.js';
import reviewModalController from './review-submit.controller.js';

export default angular.module('txReviewerModule', [])
.factory('Reviewer', reviewService)
.controller('ReviewSubmitCtrl', reviewModalController);
