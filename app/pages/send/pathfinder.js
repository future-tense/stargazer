/* global fetch */

import 'isomorphic-fetch';
import withQuery from 'with-query';

const base = 'https://pathfinder.futuretense.io';

const paths = async (sourceAccount, destAsset, destAmount) => {

	const type = destAsset.asset_type;
	const params = {
		/* eslint-disable camelcase */
		source_account: sourceAccount,
		destination_amount: destAmount.toString(),
		destination_asset_type: type,
		/* eslint-enable camelcase */
	};

	if (type !== 'native') {
		/* eslint-disable camelcase */
		params.destination_asset_code = destAsset.asset_code;
		params.destination_asset_issuer = destAsset.asset.asset_issuer;
		/* eslint-enable camelcase */
	}

	const response = await fetch(withQuery(`${base}/paths`, params));
	if (!response.ok) {
		throw response;
	}

	const data = await response.json();

	// eslint-disable-next-line no-underscore-dangle
	return data._embedded;
};

export default {
	paths
};
