The Stargazer Wallet is a mobile/desktop wallet for the Stellar payments network.

It's heavily inspired by the UX of bitcoin wallet Copay, which I just have to say I love.
It fulfills all the basic requirements set up for the Stellar Build Challange, and adds some extra features on top of that.
Currently it's a bit tied down in terms of what functionality is actually exposed to the end-user though,
because UX is just too danmed hard to get right.

* Android
* OS X
* (win64)

A quick run-down:

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

* Create/recieve payment requests using QR

* Add contacts using QR

* Add comments to transactions

* Federated addresses

Known issues:

*	Paths. They just don't work the way you'd think they do. Make sure you actually have the required amount of assets before trying to press "send".
*	I have to admit that adding anchors is a sucky experience, but it was that or nothing.
*	As always, error handling.
* Account ID in mobile. Better forget about it, it's complicated to get it out of there onto the clipboard, and writing it down manually is too much work. Scan the QR
 code instead.

NB: This is very much a pre-release Beta version. I'd suggest you don't try this out if you're not in the jury.

Android:
* https://dl.dropboxusercontent.com/u/1263552/Stargazer/stargazer.apk
* 00a15b077ef89213ee7371dd78c1be3baca771434a737a7604b95bff5aec3d98 (sha-256)

OS X:
* https://dl.dropboxusercontent.com/u/1263552/Stargazer/stargazer-osx.zip
* 87fc230c67ed8414ceca82e00ae7f1936d22b1f3a5cf32885c91960fda8a01c3 (sha-256)

Win64:
* https://dl.dropboxusercontent.com/u/1263552/Stargazer/stargazer-win64.zip
* fdff9cc50f854bac7dcbe36637889e1f6241650c9ce6948833e8b55d34c239b7 (sha-256)
