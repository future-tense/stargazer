
import reviewModal from './review-submit.html';

export default /* @ngInject */ function (Modal) {

	const review = context => {
		const data = {
			context: context
		};
		return Modal.show(reviewModal, data);
	};

	return {
		review
	};
}
