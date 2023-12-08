const mediaTemplate = (media, photographerName, modal) => {
	const { title, likes } = media;

	function getMediaCardDOM() {
		const article = document.createElement('article');

		const mediaDescription = document.createElement('div');
		const mediaTitle = document.createElement('p');
		const mediaLikes = document.createElement('span');

		article.appendChild(createMedia(media, photographerName));

		mediaDescription.classList.add('media-description');

		mediaTitle.textContent = title;
		mediaTitle.classList.add('media-title');

		article.appendChild(mediaDescription);
		mediaDescription.appendChild(mediaTitle);

		if (!modal) {
			mediaLikes.innerHTML =
				likes +
				`<svg width='20px' height='20px' viewBox='0 -1 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'>
                    <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'>
                        <g id='Icon-Set-Filled' sketch:type='MSLayerGroup' transform='translate(-102.000000, -882.000000)' fill='#901c1c'>
                            <path d='M126,882 C122.667,882 119.982,883.842 117.969,886.235 C116.013,883.76 113.333,882 110,882 C105.306,882 102,886.036 102,890.438 C102,892.799 102.967,894.499 104.026,896.097 L116.459,911.003 C117.854,912.312 118.118,912.312 119.513,911.003 L131.974,896.097 C133.22,894.499 134,892.799 134,890.438 C134,886.036 130.694,882 126,882' id='heart-like' sketch:type='MSShapeGroup'></path>
                        </g>
                    </g>
                </svg>`;
			mediaDescription.appendChild(mediaLikes);
		}

		return article;
	}
	return { media, getMediaCardDOM };
};

const createMedia = (media, photographerName) => {
	if (media.image) {
		return createImageElt(media, photographerName);
	} else if (media.video) {
		return createVideoElt(media, photographerName);
	} else {
		throw new error('Unknown media type');
	}
};

const createImageElt = (media, photographerName) => {
	const img = document.createElement('img');
	img.src = `../../assets/photographers/${formatName(photographerName)}/${
		media.image
	}`;
	img.alt = media.title;
	img.classList.add('media');
	img.id = media.id;

	return img;
};

const createVideoElt = (media, photographerName) => {
	const video = document.createElement('video');
	video.src = `../../assets/photographers/${formatName(photographerName)}/${
		media.video
	}`;
	video.type = 'video/mp4';
	video.classList.add('media');
	video.id = media.id;
	video.controls = true;

	return video;
};
