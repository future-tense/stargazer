/* global angular, console, Decimal, StellarSdk */

(function () {
	'use strict';

	angular.module('app')
	.controller('TradeCtrl', function ($scope, Wallet) {

		var issuer = 'GAZT5HHHUVBUO2ZM73X5HKXLCU4NKDDDNRIYS7SEYTS4DIRCAPIVXNGN';
		var asset1 = new StellarSdk.Asset('RED', issuer);
		var asset2 = new StellarSdk.Asset.native();	//('DDD', issuer);

		var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

		server.orderbook(asset2, asset1)	//	selling, buying
		.call()
		.then(function (res) {
			console.log(res);

			res.bids.forEach(function (bid) {
				var amount = new Decimal(bid.amount);
				amount = amount.times(new Decimal(bid.price_r.d));
				amount = amount.dividedBy(new Decimal(bid.price_r.n));
				bid.amount = amount.toFixed(7);
			});

			$scope.asks = res.asks;
			$scope.bids = res.bids;
			$scope.$apply();
		});
	});
})();
