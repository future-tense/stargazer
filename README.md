# The Stargazer Wallet is a mobile/desktop wallet for the Stellar payments network.

It's heavily inspired by the UX of bitcoin wallet Copay, which I just have to say I love.
It fulfills all the basic requirements set up for the Stellar Build Challenge, and adds some extra features on top of that.
Currently it's a bit tied down in terms of what functionality is actually exposed to the end-user though,
because UX is just too damned hard to get right.

* Android
* OS X
* (win64)


# A quick feature run-down:

* Multiple accounts

* Multiple assets

* Multiple networks
	* Partially exposed through QR import

* Simple multi-sig
	* If you have all the required signing accounts in the same wallet
	* This means you can "re-key" an account to have a completely different signer, as long as it's an account in the wallet.

* Import/export accounts
	* QR
	* Manual input

* Create/receive payment requests using QR

* Add contacts using QR

* Add comments to transactions

* Federated addresses

# Known issues:

* Paths. They just don't work the way you'd think they do. Make sure you actually have the required amount of assets before trying to press "send".
* I have to admit that adding anchors is a sucky experience, but it was that or nothing.
* As always, error handling.
* Account ID in mobile. Better forget about it, it's complicated to get it out of there onto the clipboard, and writing it down manually is too much work. Scan the QR
 code instead.

NB: This is very much a pre-release Beta version. I'd suggest you don't try this out if you're not in the jury.


# Testing

* Test folder contains two QR codes to scan, to get a couple of accounts into the wallet, so you can send 
things to and from. NB: *These are both on testnet*.

* Otherwise, the way I recommend is to use either one of the desktop apps to import seeds into, to then
export to the mobile app.

# QR code format

The QR codes contain JSON encoded data structures.

## Contact

```
{
	"stellar": {
		"account": {
			"id": ACCOUNT_ID,
			"network": NETWORK_PASSPHRASE
		}
	}
}
```

Network is only needed if not stellar.org live network

## Payment request

```
{
	"stellar": {
		"payment": {
			"destination":	ACCOUNT_ID,
			"amount":			AMOUNT,
			"asset": {
				"code":		ASSET_CODE,
				"issuer":		ASSET_ISSER
			}
		}
	}
}
```
Asset is only needed if not XLM

## Account export/import

```
{
	"stellar": {
		"account": {
			"network": NETWORK_PASSPHRASE
		},
		"key": SEED or encrypted seed
	}
}
```

# LICENSE

Stargazer is released under the GNU Affero General Public License v3 (AGPL), except for the following files
* app/core/controllers/scanner.js
* app/core/directives/qr-scanner.js
* app/core/services/platform-info.js
which originate from Copay, and are made available under the terms of the MIT License.
