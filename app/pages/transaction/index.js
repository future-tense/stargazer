/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import TransactionController from './transaction.component';
import transactionTemplate from './transaction.html';

import addContactController from './add-contact.controller';
import editCommentController from './edit-txcomment.controller';

import routes from './config.route';

export default angular.module('transactionPageModule', [])
.component('transaction',  {
	controller: TransactionController,
	controllerAs: 'vm',
	require: {
		index: '^index'
	},
	template: transactionTemplate
})
.controller('AddContactFromTxCtrl', addContactController)
.controller('EditTransactionCommentCtrl', editCommentController)
.config(routes);
