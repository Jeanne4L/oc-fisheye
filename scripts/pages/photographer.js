import { mediaTemplate } from '../templates/media.js';
import contactForm from '../utils/contactForm.js';
import { focusTrap, cancelFocusTrap } from '../helpers/focusTrap.js';

const toggleFiltersListButton = document.querySelector('#sort-button');
const sortFiltersList = document.querySelector('#sort-filters');
const activeFiltersOptions = document.querySelectorAll('.sort-filters-option');
const mediaContainer = document.querySelector('#medias');
const mediaModal = document.getElementById('media-modal-overlay');
const closeButton = document.querySelector('#media-close-button');
const prevButton = document.querySelector('#media-prev-button');
const nextButton = document.querySelector('#media-next-button');
let currentMedia = null;
let index;

// Get id in url
const params = new URL(document.location).searchParams;
const id = parseInt(params.get('id'));

const getPhotographer = async () => {
	try {
		const response = await fetch('../../data/photographers.json');
		if (!response.ok) {
			throw new Error(`Network response was not ok: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};

const displayMedia = (media, photographerName) => {
	media.forEach((mediaItem) => {
		const mediaModel = mediaTemplate(mediaItem, photographerName, false);
		const mediaCardDOM = mediaModel.getMediaCardDOM();
		mediaContainer.appendChild(mediaCardDOM);
		mediaCardDOM.addEventListener('click', (e) =>
			openMediaModal(e, media, photographerName)
		);
		mediaCardDOM.addEventListener('keydown', (e) => {
			if (e.key == 'Enter') {
				openMediaModal(e, media, photographerName);
			}
		});
		mediaCardDOM.setAttribute('tabindex', '0');
		mediaCardDOM.setAttribute('role', 'button');
	});
};

const displaySelectedMediaInModal = (
	mediaToDisplay,
	photographerName,
	isDisplayedInModal,
	eltToInsertBefore
) => {
	const mediaModel = mediaTemplate(
		mediaToDisplay,
		photographerName,
		isDisplayedInModal
	);
	const mediaCardDOM = mediaModel.getMediaCardDOM();

	if (currentMedia) {
		currentMedia.remove();
	}

	currentMedia = mediaCardDOM;
	eltToInsertBefore.parentNode.insertBefore(
		mediaCardDOM,
		eltToInsertBefore.nextSibling
	);
};

const calculateTotalCountOfLikes = (media) => {
	let total = 0;
	media.forEach((m) => {
		total += m.likes;
	});
	return total;
};

const displayTotalLikes = (media) => {
	const totalLikes = document.createElement('div');
	const totalLikesCount = document.createElement('span');
	totalLikes.classList.add('total-likes');

	const totalLikesIcon = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'svg'
	);
	totalLikesIcon.setAttribute('viewBox', '0 -1 32 32');

	const groupElement = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'g'
	);
	groupElement.setAttribute('aria-label', 'likes');
	groupElement.setAttribute('transform', 'translate(-102.000000, -882.000000)');
	groupElement.setAttribute('fill', '#000');

	const pathElement = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'path'
	);
	pathElement.setAttribute(
		'd',
		'M126,882 C122.667,882 119.982,883.842 117.969,886.235 C116.013,883.76 113.333,882 110,882 C105.306,882 102,886.036 102,890.438 C102,892.799 102.967,894.499 104.026,896.097 L116.459,911.003 C117.854,912.312 118.118,912.312 119.513,911.003 L131.974,896.097 C133.22,894.499 134,892.799 134,890.438 C134,886.036 130.694,882 126,882'
	);
	pathElement.setAttribute('sketch:type', 'MSShapeGroup');

	totalLikesIcon.appendChild(groupElement);
	groupElement.appendChild(pathElement);

	totalLikesCount.textContent = calculateTotalCountOfLikes(media);
	totalLikes.appendChild(totalLikesCount);
	totalLikes.appendChild(totalLikesIcon);

	return totalLikes;
};

const displayPhotographerDescription = (name, tagline, city, country) => {
	const photographerDescription = document.createElement('div');

	const nameH1 = document.createElement('h1');
	nameH1.textContent = name;

	const location = document.createElement('h2');
	location.textContent = `${city}, ${country}`;
	location.classList.add('location');

	const tagLine = document.createElement('p');
	tagLine.textContent = tagline;
	tagLine.classList.add('tagline');

	photographerDescription.appendChild(nameH1);
	photographerDescription.appendChild(location);
	photographerDescription.appendChild(tagLine);

	return photographerDescription;
};

const displayInfoBox = (media, price) => {
	const infoBox = document.createElement('div');
	infoBox.classList.add('info-box');

	const tariff = document.createElement('span');
	tariff.textContent = `${price}€ / jour`;
	tariff.classList.add('tariff');

	infoBox.appendChild(displayTotalLikes(media));
	infoBox.appendChild(tariff);

	return infoBox;
};

const toggleFiltersList = () => {
	toggleFiltersListButton.classList.toggle('returned-button');
	if (toggleFiltersListButton.getAttribute('aria-expanded') == 'false') {
		toggleFiltersListButton.setAttribute('aria-expanded', 'true');
	} else {
		toggleFiltersListButton.setAttribute('aria-expanded', 'false');
	}

	sortFiltersList.classList.toggle('displayed-list');

	focusTrap(
		toggleFiltersListButton,
		activeFiltersOptions[activeFiltersOptions.length - 1]
	);
};

const sortMedias = (media, photographerName, filter) => {
	let sortedMedia;

	if (filter.tagName === 'LI') {
		if (filter.id === 'sort-popularity') {
			sortedMedia = media.sort((a, b) => b.likes - a.likes);
		} else if (filter.id === 'sort-date') {
			sortedMedia = media.sort((a, b) => {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);
				return dateA - dateB;
			});
		} else if (filter.id === 'sort-title') {
			sortedMedia = media.sort((a, b) =>
				a.title.localeCompare(b.title, 'en', { ignorePunctuation: true })
			);
		}
		mediaContainer.innerHTML = '';
		displayMedia(sortedMedia, photographerName);
		cancelFocusTrap(
			toggleFiltersListButton,
			activeFiltersOptions[activeFiltersOptions.length - 1]
		);
		toggleFiltersList();
	}
};

const sortMediasEvent = (media, photographerName) => {
	activeFiltersOptions.forEach((activeFiltersOption) => {
		activeFiltersOption.addEventListener('focus', (e) => {
			const selectedFilter = e.target;
			selectedFilter.setAttribute('aria-selected', 'true');
		});

		activeFiltersOption.addEventListener('blur', (e) => {
			const selectedFilter = e.target;
			selectedFilter.setAttribute('aria-selected', 'false');
		});
	});

	sortFiltersList.addEventListener('click', function (e) {
		const filter = e.target;
		sortMedias(media, photographerName, filter);
	});

	sortFiltersList.addEventListener('keydown', function (e) {
		if (e.key == 'Enter') {
			const filter = e.target;
			sortMedias(media, photographerName, filter);
		}
	});
};

export const openMediaModal = (e, media, photographerName) => {
	e.preventDefault();

	mediaModal.style.display = 'flex';
	document.body.style.overflow = 'hidden';

	const displayedMedia = media.find((med) => med.id === Number(e.target.id));
	index = media.indexOf(displayedMedia);

	displaySelectedMediaInModal(
		displayedMedia,
		photographerName,
		true,
		prevButton
	);

	nextButton.focus();

	focusTrap(closeButton, nextButton);
};

const scrollMedia = (currentIndex, media, photographerName, direction) => {
	currentIndex = (currentIndex + direction + media.length) % media.length;

	const mediaToDisplay = media[currentIndex];

	index = currentIndex;

	displaySelectedMediaInModal(
		mediaToDisplay,
		photographerName,
		true,
		prevButton
	);
};

const closeMediaModal = () => {
	mediaModal.style.display = 'none';
	document.body.style.overflow = 'visible';

	cancelFocusTrap(closeButton, nextButton);
};

const displayPhotographerData = async (photographer, media) => {
	const { name, id, city, country, tagline, price, portrait } = photographer;

	document.title = `Fisheye - ${name}`;

	// display photographer's banner
	const banner = document.querySelector('.photograph-header');

	const picture = `assets/photographers/${portrait}`;
	const photographerImg = document.createElement('img');
	photographerImg.src = picture;
	photographerImg.alt = name;

	banner.prepend(displayPhotographerDescription(name, tagline, city, country));
	banner.appendChild(photographerImg);

	contactForm();

	toggleFiltersListButton.addEventListener('click', () => toggleFiltersList());
	toggleFiltersListButton.addEventListener('keydown', (e) => {
		if (e.key == 'Enter') {
			toggleFiltersList();
		}
	});

	sortMediasEvent(media, name);

	displayMedia(media, name);

	// display info box with likes and price
	const main = document.querySelector('main');
	main.appendChild(displayInfoBox(media, price));

	// display photographer name in the contact modal
	const modalTitle = document.querySelector('#modal-title');
	modalTitle.innerHTML += '<br>' + name;

	// Change media in modal
	prevButton.addEventListener('click', () =>
		scrollMedia(index, media, name, -1)
	);
	prevButton.addEventListener('keydown', (e) => {
		if (e.key == 'Enter') {
			scrollMedia(index, media, name, -1);
		}
	});
	nextButton.addEventListener('click', () =>
		scrollMedia(index, media, name, 1)
	);
	nextButton.addEventListener('keydown', (e) => {
		if (e.key == 'Enter') {
			scrollMedia(index, media, name, 1);
		}
	});

	closeButton.addEventListener('click', closeMediaModal);
	closeButton.addEventListener('keydown', (e) => {
		if (e.key == 'Enter') {
			closeMediaModal();
		}
	});
};

const init = async () => {
	const { photographers, media } = await getPhotographer();

	const photographerData = photographers.find(
		(photographer) => photographer.id === id
	);

	const photographerMedia = media.filter((m) => m.photographerId === id);
	displayPhotographerData(photographerData, photographerMedia);
};
init();
