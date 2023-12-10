export const calculateMediaSizeWithRatio = (
	eltToResize,
	maxSizeInPercentage
) => {
	let width = eltToResize.width;
	let height = eltToResize.height;

	let screenWidth = window.innerWidth;
	let screenHeight = window.innerHeight;

	let mediaRatio = width / height;

	let maxSize =
		Math.min(screenWidth, screenHeight) * (maxSizeInPercentage / 100);

	if (width > height) {
		width = maxSize;
		height = maxSize / mediaRatio;
	} else {
		height = maxSize;
		width = maxSize * mediaRatio;
	}

	eltToResize.style.width = width + 'px';
	eltToResize.style.height = height + 'px';

	return eltToResize;
};
