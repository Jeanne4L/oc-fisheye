import { formatNameToFileName } from '../helpers/formatNameToFileName.js';
import { calculateMediaSizeWithRatio } from '../helpers/calculateMediaSizeWithRatio.js';
import heartIcon from '../components/heartIcon.js';

export const mediaTemplate = (media, photographerName, isDisplayedInModal) => {
	const { title, likes } = media;

	function getMediaCardDOM() {
		const article = document.createElement('article');

		const mediaDescription = document.createElement('div');
		mediaDescription.classList.add('media-description');

		const mediaTitle = document.createElement('p');
		mediaTitle.textContent = title;
		mediaTitle.classList.add('media-title');

		const mediaLikes = document.createElement('div');
		mediaLikes.classList.add('media-likes');
		const likesCount = document.createElement('span');

		const likesIcon = heartIcon('#901c1c');
		likesIcon.addEventListener('click', incrementLikes);

		article.appendChild(
			createMedia(media, photographerName, isDisplayedInModal)
		);
		article.appendChild(mediaDescription);
		mediaDescription.appendChild(mediaTitle);

		if (!isDisplayedInModal) {
			likesCount.textContent = likes;
			mediaLikes.appendChild(likesCount);
			mediaLikes.appendChild(likesIcon);
			mediaDescription.appendChild(mediaLikes);
		}

		function incrementLikes() {
			likesCount.textContent = likes + 1;
		}

		return article;
	}
	return { media, getMediaCardDOM };
};

const createMedia = (media, photographerName, isDisplayedInModal) => {
	if (media.image) {
		return createImageElt(media, photographerName, isDisplayedInModal);
	} else if (media.video) {
		return createVideoElt(media, photographerName, isDisplayedInModal);
	} else {
		throw new error('Unknown media type');
	}
};

const createImageElt = (media, photographerName, isDisplayedInModal) => {
	const img = document.createElement('img');
	img.src = `../../assets/photographers/${formatNameToFileName(
		photographerName
	)}/${media.image}`;
	img.alt = media.title;
	img.id = media.id;
	img.classList.add('media');
	img.setAttribute('tabindex', '0');
	img.setAttribute('role', 'button');

	if (isDisplayedInModal) {
		calculateMediaSizeWithRatio(img, 80);
	}

	return img;
};

const createVideoElt = (media, photographerName, isDisplayedInModal) => {
	const video = document.createElement('video');
	video.src = `../../assets/photographers/${formatNameToFileName(
		photographerName
	)}/${media.video}`;
	video.type = 'video/mp4';
	video.classList.add('media');
	video.id = media.id;
	video.setAttribute('tabindex', '0');
	video.setAttribute('role', 'button');
	video.controls = true;
	if (isDisplayedInModal) {
		video.autoplay = true;
		calculateMediaSizeWithRatio(video, 80);
	}

	return video;
};
