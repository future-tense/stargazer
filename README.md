
# Main features:

* Multiple accounts

* Multiple assets

* Multiple networks

* Import/export accounts
	* QR
	* Manual input

* Create/receive payment requests using QR

* Add contacts
	* using QR
	* from a transaction

* Add comments to transactions

* Federated addresses

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
