import { mediaTemplate } from '../templates/media.js';
import contactForm from '../utils/contactForm.js';
import { focusTrap, cancelFocusTrap } from '../helpers/focusTrap.js';
import heartIcon from '../components/heartIcon.js';

const toggleFiltersListButton = document.querySelector('#sort-button');
const sortFiltersList = document.querySelector('#sort-filters');
const activeFiltersOptions = document.querySelectorAll('.sort-filters-option');
const mediaContainer = document.querySelector('#medias');
const mediaModal = document.getElementById('media-modal-overlay');
const closeButton = document.querySelector('#media-close-button');
const prevButton = document.querySelector('#media-prev-button');
const nextButton = document.querySelector('#media-next-button');
let clickedMedia = null;
let currentMedia = null;
let totalLikesCount = 0;
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

const displayMedias = (media, photographerName) => {
	totalLikesCount = calculateTotalCountOfLikes(media);

	media.forEach((mediaItem) => {
		const mediaModel = mediaTemplate(mediaItem, photographerName, false);
		const mediaCardDOM = mediaModel.getMediaCardDOM();
		mediaContainer.appendChild(mediaCardDOM);

		mediaCardDOM.addEventListener('click', (e) => {
			if (
				e.target.closest('svg') &&
				e.target.closest('svg').classList.contains('likes-button')
			) {
				incrementLikes(e, mediaItem, mediaCardDOM);
			}
			openMediaModal(e, media, photographerName);
		});
		mediaCardDOM.addEventListener('keydown', (e) => {
			if (e.key == 'Enter') {
				openMediaModal(e, media, photographerName);
			}
			if (e.target.classList.contains('likes-button') && e.key == 'Enter') {
				incrementLikes(e, mediaItem, mediaCardDOM);
			}
		});
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

const incrementLikes = (e, mediaItem, mediaCardDOM) => {
	const newLikesCount = (mediaItem.likes += 1);
	totalLikesCount = totalLikesCount += 1;
	mediaCardDOM.querySelector('.likes-count').textContent = newLikesCount;
	document.querySelector('.total-likes').textContent = totalLikesCount;

	e.target.closest('svg').classList.remove('likes-button');
};

const calculateTotalCountOfLikes = (media) => {
	let total = 0;
	media.forEach((mediaItem) => {
		total += mediaItem.likes;
	});
	return total;
};

const displayTotalLikes = () => {
	const totalLikesDiv = document.createElement('div');
	totalLikesDiv.classList.add('total-likes-container');

	const totalLikesCountDiv = document.createElement('span');
	totalLikesCountDiv.classList.add('total-likes');

	totalLikesCountDiv.textContent = totalLikesCount;
	totalLikesDiv.appendChild(totalLikesCountDiv);
	totalLikesDiv.appendChild(heartIcon('#000'));

	return totalLikesDiv;
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

const displayInfoBox = (price) => {
	const infoBox = document.createElement('div');
	infoBox.classList.add('info-box');

	const tariff = document.createElement('span');
	tariff.textContent = `${price}€ / jour`;
	tariff.classList.add('tariff');

	infoBox.appendChild(displayTotalLikes());
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
	activeFiltersOptions.forEach((filter) =>
		filter.classList.toggle('no-clickable')
	);

	focusTrap(document.querySelector('.sort-filters'), null, null);
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
		displayMedias(sortedMedia, photographerName);
		cancelFocusTrap(document.querySelector('.sort-filters'), null, null);
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

	sortFiltersList.addEventListener('click', (e) => {
		const filter = e.target;
		sortMedias(media, photographerName, filter);
	});

	sortFiltersList.addEventListener('keydown', (e) => {
		if (e.key == 'Enter') {
			const filter = e.target;
			sortMedias(media, photographerName, filter);
		}
	});
};

export const openMediaModal = (e, media, photographerName) => {
	if (e.target.classList.contains('media')) {
		clickedMedia = e.target;

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

		focusTrap(document.querySelector('.media-modal'), null, null);
	}
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

	cancelFocusTrap(document.querySelector('.media-modal'), null, null);

	if (clickedMedia) {
		setTimeout(() => {
			clickedMedia.focus();
		}, 0);
	}
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

	if (toggleFiltersListButton.getAttribute('aria-expanded') == 'false') {
		activeFiltersOptions.forEach((filter) =>
			filter.classList.add('no-clickable')
		);
	}
	toggleFiltersListButton.addEventListener('click', () => {
		// activeFiltersOptions.forEach((filter) => {
		// 	filter.classList.toggle('no-clickable');
		// });

		toggleFiltersList();
	});

	toggleFiltersListButton.addEventListener('keydown', (e) => {
		if (e.key == 'Enter') {
			toggleFiltersList();
		}
		if (toggleFiltersListButton.getAttribute('aria-expanded') == 'false') {
			activeFiltersOptions.forEach((filter) =>
				filter.setAttribute('tabindex', '-1')
			);
		} else {
			activeFiltersOptions.forEach((filter) => {
				filter.setAttribute('tabindex', '0');
			});
		}
	});

	sortMediasEvent(media, name);

	displayMedias(media, name);

	// display info box with likes and price
	const main = document.querySelector('main');
	main.appendChild(displayInfoBox(price));

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
