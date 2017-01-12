# QR code formats

The QR codes contain JSON encoded data structures.

## Contact

```javascript
{
    "stellar": {
        "account": {
            "id":       ACCOUNT_ID,
            "network":  NETWORK_CODE // (*)
        }
    }
}
```

*) Network is only needed if not stellar.org live network

## Payment request

```javascript
{
    "stellar": {
        "payment": {
            "destination":  ACCOUNT_ID,
            "network":      NETWORK_CODE, // (*)
            "amount":       AMOUNT,
            "asset": {      // (**)
                "code":     ASSET_CODE,
                "issuer":   ASSET_ISSER
            }
        }
    }
}
```

*) Network is only needed if not stellar.org live network

**) Asset is only needed if not XLM

## Account export/import

```javascript
{
    "stellar": {
        "account": {
            "network": NETWORK_CODE
        },
        "key": SEED or encrypted seed
    }
}
```

Here, network is mandatory, since it defines *where* an account has been registered. 

## Specifying a Network

NETWORK_CODE is the first eight hex characters of the SHA-256 hash of the network passphrase,

```javascript
function getHash(passphrase) {
    return new StellarSdk.Network(passphrase)
    .networkId().toString('hex').slice(0, 8);
}
```

Examples:

* Live net - "7ac33997"
* Test net - "cee0302d"



