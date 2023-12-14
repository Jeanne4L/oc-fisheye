const heartIcon = (color) => {
	const heartIcon = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'svg'
	);
	heartIcon.setAttribute('viewBox', '0 -1 33 32');

	const groupElement = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'g'
	);
	groupElement.setAttribute('aria-label', 'likes');
	groupElement.setAttribute('transform', 'translate(-102.000000, -882.000000)');
	groupElement.setAttribute('fill', color);

	const pathElement = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'path'
	);
	pathElement.setAttribute(
		'd',
		'M126,882 C122.667,882 119.982,883.842 117.969,886.235 C116.013,883.76 113.333,882 110,882 C105.306,882 102,886.036 102,890.438 C102,892.799 102.967,894.499 104.026,896.097 L116.459,911.003 C117.854,912.312 118.118,912.312 119.513,911.003 L131.974,896.097 C133.22,894.499 134,892.799 134,890.438 C134,886.036 130.694,882 126,882'
	);
	pathElement.setAttribute('sketch:type', 'MSShapeGroup');

	groupElement.appendChild(pathElement);
	heartIcon.appendChild(groupElement);

	return heartIcon;
};

export default heartIcon;
