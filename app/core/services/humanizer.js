/* global */

function parse(tx, current) {

	const res = [];
	tx.operations.forEach((op) => {

		const func = {
			'accountMerge':			accountMergeOp,
			'allowTrust':			allowTrustOp,
			'changeTrust':			changeTrustOp,
			'createAccount':		createAccountOp,
			'createPassiveOffer':	createPassiveOfferOp,
			'inflation': 			inflationOp,
			'manageData': 			manageDataOp,
			'manageOffer':			manageOfferOp,
			'pathPayment':			pathPaymentOp,
			'payment':				paymentOp,
			'setOptions':			setOptionsOp
		};

		const source = op.source || tx.source;
		func[op.type](current, source, op, res);
	});

	return res;
}

function accountMergeOp(current, account, op, res) {
	const source = getAccount(account);
	const dest = getAccount(op.destination);
	res.push(`Merge ${source} into ${dest}`);
}

function allowTrustOp(current, account, op, res) {
	const trustor = getAccount(op.trustor);
	const asset	  = (current === account) ? op.assetCode : getAsset({code:op.assetCode, issuer:account});
	if (op.authorize === 'true') {
		res.push(`Authorize ${trustor} to hold ${asset}`);
	} else {
		res.push(`Deauthorize ${trustor} to hold ${asset}`);
	}
}

function changeTrustOp(current, account, op, res) {
	const asset = getAsset(op.line);
	const source = getAccount(account);
	if (op.limit === '0') {
		if (current === account) {
			res.push(`Remove trust for ${asset}`);
		} else {
			res.push(`Remove trust for ${asset} from ${source}`);
		}
	} else {
		if (current === account) {
			res.push(`Add trust for ${asset}`);
		} else {
			res.push(`Add trust for ${asset} to ${source}`);
		}
	}
}

function createAccountOp(current, account, op, res) {
	const amount = getAmount(op.startingBalance);
	const source = getAccount(account);
	const dest = getAccount(op.destination);
	if (current === account) {
		res.push(`Create ${dest} with ${amount} XLM`);
	} else {
		res.push(`Create ${dest} with ${amount} XLM from ${source}`);
	}
}

function createPassiveOfferOp(current, account, op, res) {
	const asset1 = getAsset(op.selling);
	const asset2 = getAsset(op.buying);
	const amount1 = getAmount(op.amount);
	const amount2 = getAmount(op.amount * op.price);
	const source = getAccount(account);

	if (op.amount === '0') {
		if (current === account) {
			res.push(`Cancel passive offer #${op.offerId} to sell ${asset1} for ${asset2}`);
		} else {
			res.push(`Cancel passive offer #${op.offerId} for ${source} to sell ${asset1} for ${asset2}`);
		}
	}

	else if (op.offerId !== '0') {
		if (current === account) {
			res.push(`Update passive offer #${op.offerId} to sell ${amount1} ${asset1} for ${amount2} ${asset2}`);
		} else {
			res.push(`Update passive offer #${op.offerId} for ${source} to sell ${amount1} ${asset1} for ${amount2} ${asset2}`);
		}
	}

	else {
		if (current === account) {
			res.push(`Create a passive offer to sell ${amount1} ${asset1} for ${amount2} ${asset2}`);
		} else {
			res.push(`Create a passive offer for ${source} to sell ${amount1} ${asset1} for ${amount2} ${asset2}`);
		}
	}
}

function inflationOp(current, account, op, res) {
	res.push('Run inflation');
}

function manageDataOp(current, account, op, res) {
	const source = getAccount(account);
	const key = op.name;
	if (op.value) {
		const value = btoa(String.fromCharCode.apply(null, op.value));
		if (current === account) {
			res.push(`Set data entry "${key}" to ${value}`);
		} else {
			res.push(`Set data entry "${key}" for ${source} to ${value}`);
		}
	} else {
		if (current === account) {
			res.push(`Remove data entry "${key}"`);
		} else {
			res.push(`Remove data entry "${key}" for ${source}`);
		}
	}
}

function manageOfferOp(current, account, op, res) {
	const asset1 = getAsset(op.selling);
	const asset2 = getAsset(op.buying);
	const amount1 = getAmount(op.amount);
	const amount2 = getAmount(op.amount * op.price);
	const source = getAccount(account);

	if (op.amount === '0') {
		if (current === account) {
			res.push(`Cancel offer #${op.offerId} to sell ${asset1} for ${asset2}`);
		} else {
			res.push(`Cancel offer #${op.offerId} for ${source} to sell ${asset1} for ${asset2}`);
		}
	}

	else if (op.offerId !== '0') {
		if (current === account) {
			res.push(`Update offer #${op.offerId} to sell ${amount1} ${asset1} for ${amount2} ${asset2}`);
		} else {
			res.push(`Update offer #${op.offerId} for ${source} to sell ${amount1} ${asset1} for ${amount2} ${asset2}`);
		}
	}

	else {
		if (current === account) {
			res.push(`Create an offer to sell ${amount1} ${asset1} for ${amount2} ${asset2}`);
		} else {
			res.push(`Create an offer for ${source} to sell ${amount1} ${asset1} for ${amount2} ${asset2}`);
		}
	}
}

function paymentOp(current, account, op, res) {
	const amount = getAmount(op.amount);
	const asset = getAsset(op.asset);
	const source = getAccount(account);
	const dest = getAccount(op.destination);

	if (op.asset.issuer === account) {
		res.push(`Issue ${amount} ${asset} to ${dest}`);
	} else {
		if (current === account) {
			res.push(`Send ${amount} ${asset} to ${dest}`);
		} else {
			res.push(`Send ${amount} ${asset} from ${source} to ${dest}`);
		}
	}
}

function pathPaymentOp(current, account, op, res) {
	const amount1 = getAmount(op.destAmount);
	const asset1 = getAsset(op.destAsset);
	const amount2 = getAmount(op.sendMax);
	const asset2 = getAsset(op.sendAsset);
	const source = getAccount(account);
	const dest = getAccount(op.destination);

	if (current === account) {
		res.push(`Send ${amount1} ${asset1} to ${dest}, paying up to ${amount2} ${asset2}`);
	} else {
		res.push(`Send ${amount1} ${asset1} from ${source} to ${dest}, paying up to ${amount2} ${asset2}`);
	}
}

function setOptionsOp(current, account, op, res) {

	const source = getAccount(account);

	if (op.setFlags) {
		if (op.setFlags & 1) {
			if (current === account) {
				res.push('Set authorization required flag');
			} else {
				res.push(`Set authorization required flag for ${source}`);
			}
		}
		if (op.setFlags & 2) {
			if (current === account) {
				res.push('Set authorization revocable flag');
			} else {
				res.push(`Set authorization revocable flag for ${source}`);
			}
		}
		if (op.setFlags & 4) {
			if (current === account) {
				res.push('Set authorization immutable flag');
			} else {
				res.push(`Set authorization immutable flag for ${source}`);
			}
		}
	}

	if (op.clearFlags) {
		if (op.clearFlags & 1) {
			if (current === account) {
				res.push('Clear authorization required flag');
			} else {
				res.push(`Clear authorization required flag for ${source}`);
			}
		}
		if (op.clearFlags & 2) {
			if (current === account) {
				res.push('Clear authorization revocable flag');
			} else {
				res.push(`Clear authorization revocable flag for ${source}`);
			}
		}
		if (op.clearFlags & 4) {
			if (current === account) {
				res.push('Clear authorization immutable flag');
			} else {
				res.push(`Clear authorization immutable flag for ${source}`);
			}
		}
	}

	if (op.homeDomain) {
		if (current === account) {
			res.push(`Set home domain to "${op.homeDomain}"`);
		} else {
			res.push(`Set home domain for ${source} to "${op.homeDomain}"`);
		}
	}

	if (op.inflationDest) {
		const dest = getAccount(op.inflationDest);
		if (current === account) {
			res.push(`Set inflation destination to ${dest}`);
		} else {
			res.push(`Set inflation destination for ${source} to ${dest}`);
		}
	}

	if (op.signer) {
		const weight = op.signer.weight;
		if (op.signer.preAuthTx) {
			const hash = op.signer.preAuthTx;
			if (weight !== 0) {
				if (current === account) {
					res.push(`Pre-authorize transaction ${hash}, with weight ${weight}`);
				} else {
					res.push(`Pre-authorize transaction ${hash} for ${source}, with weight ${weight}`);
				}
			}
		}
		if (op.signer.ed25519PublicKey) {
			const signer = getAccount(op.signer.ed25519PublicKey);
			if (weight !== 0) {
				if (current === account) {
					res.push(`Add ${signer} as signer, with weight ${weight}`);
				} else {
					res.push(`Add ${signer} as signer for ${source}, with weight ${weight}`);
				}
			} else {
				if (current === account) {
					res.push(`Remove ${signer} as signer`);
				} else {
					res.push(`Remove ${signer} as signer for ${source}`);
				}
			}
		}
	}

	if (typeof op.masterWeight !== 'undefined') {
		if (current === account) {
			res.push(`Set master weight to ${op.masterWeight}`);
		} else {
			res.push(`Set master weight of ${source} to ${op.masterWeight}`);
		}
	}

	if (op.lowThreshold && op.medThreshold && op.highThreshold) {
		if (current === account) {
			res.push(`Set signature thresholds to [${op.lowThreshold}, ${op.medThreshold}, ${op.highThreshold}]`);
		} else {
			res.push(`Set signature thresholds for ${source} to [${op.lowThreshold}, ${op.medThreshold}, ${op.highThreshold}]`);
		}
	} else {
		if (op.lowThreshold) {
			if (current === account) {
				res.push(`Set Low signature threshold to ${op.lowThreshold}`);
			} else {
				res.push(`Set Low signature threshold for ${source} to ${op.lowThreshold}`);
			}
		}
		if (op.medThreshold) {
			if (current === account) {
				res.push(`Set Medium signature threshold to ${op.medThreshold}`);
			} else {
				res.push(`Set Medium signature threshold for ${source} to ${op.medThreshold}`);
			}
		}
		if (op.highThreshold) {
			if (current === account) {
				res.push(`Set High signature threshold to ${op.highThreshold}`);
			} else {
				res.push(`Set High signature threshold for ${source} to ${op.highThreshold}`);
			}
		}
	}
}

// ------------------------------------------------------------------------

function getAccount(id) {
	return `<account-name id="${id}"></account-name>`;
}

function getAmount(amount) {
	return `{{'${amount}'|formatAmount}}`;
}

function getAsset(asset) {
	return (asset.code === 'XLM') ? 'XLM' : `${asset.code}.<account-name id="${asset.issuer}"></account-name>`;
}

// ------------------------------------------------------------------------

export default {
	parse: parse
};

