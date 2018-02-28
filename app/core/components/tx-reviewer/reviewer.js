
export default /* @ngInject */ function (Modal) {

	const review = context => {
		const data = {
			context: context
		};
		return Modal.show('app/core/components/tx-reviewer/review-submit.html', data);
	};

	return {
		review
	};
}
