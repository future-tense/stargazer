# Stargazer

A wallet application for the [Stellar](https://stellar.org) platform. Desktop and Mobile.


## Main features:

* Multiple accounts

* Multiple account types
	* Personal accounts
	* Shared accounts

* Multiple assets
    * Issue/Redeem
    * Send/Receive/Trade

* Multiple networks

* Send to
    * Stellar addresses
    * Federated addresses
    * Email addresses

* Create/receive payment requests

* Create/receive multi-sig/multi-party signing requests

* Add contacts
    * using QR code
    * from a transaction

* Add comments to transactions

* Import/export accounts
    * QR code
    * Manual input


## Security

All private keys are stored in localStorage, encrypted or not. Within the app, key decryption and transaction signing all take place inside the `Keychain` service in `app/core/services/keychain.js`. The only time an unencrypted private key leaves that service is when an account is being exported and you're not using password protection.

All transactions go through the same steps of being displayed for review before being signed and submitted.

## Translations

- Go to https://crowdin.com/project/stargazer and sign up.
- Select the language you want to translate.
- Select the "en.json" file.
- Start translating words/phrases.

*NB: Some of the phrases contains placeholders, e.g. `{{key}}`, where the placeholder `key` mustn't be translated.
Some of the phrases, specifically the `XX days/hours/minutes/seconds ago` ones, have both a singular and a plurar form that should be translated.*


## Build instructions

### Building the baseline app
```
npm install
npm run clean
npm run build, or npm run build-prod
```

### Building for desktop
```
cd electron
npm install
npm run start
```

### Building for mobile
```
cd ionic
npm install -g ionic
npm install -g cordova
npm install

ionic cordova resources android --icon
ionic cordova prepare
npm run start
```


## License

Apart from the following files:

* app/core/controllers/scanner.js
* app/core/directives/qr-scanner.js
* app/core/services/platform-info.js

which originate from **Copay**, and are made available under the terms of the **MIT License**,
**Stargazer** is *not* open source.

Contact <hello@futuretense.io> for inquiries about commercial licensing, white labeling, etc.


Copyright &copy; 2016-2019 Future Tense, LLC
