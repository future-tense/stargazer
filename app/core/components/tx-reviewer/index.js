/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import reviewService from './reviewer.service';
import signerService from './signer.service';
import submitService from './submitter.service';
import reviewModalController from './review-submit.controller';

export default angular.module('txReviewerModule', [])
.factory('Reviewer', reviewService)
.factory('Signer', signerService)
.factory('Submitter', submitService)
.controller('ReviewSubmitCtrl', reviewModalController);
