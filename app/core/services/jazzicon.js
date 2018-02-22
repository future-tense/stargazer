
import jazzicon from 'jazzicon';

const djb2Code = (str) =>
	[...str].map(char => char.charCodeAt(0))
	.reduce((hash, item) => (hash << 5) + hash + item, 5381);

const render = (seed) => jazzicon(40, djb2Code(seed));

export default {
	render: render
};

