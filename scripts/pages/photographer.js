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

const calculateTotalCountOfLikes = (media) => {
	let total = 0;
	media.forEach((m) => {
		total += m.likes;
	});
	return total;
};

const displayTotalLikes = (media) => {
	const totalLikes = document.createElement('span');
	totalLikes.classList.add('total-likes');
	totalLikes.innerHTML =
		calculateTotalCountOfLikes(media) +
		`<svg width='20px' height='20px' viewBox='0 -1 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'>
            <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'>
                <g id='Icon-Set-Filled' sketch:type='MSLayerGroup' transform='translate(-102.000000, -882.000000)' fill='#000'>
                    <path d='M126,882 C122.667,882 119.982,883.842 117.969,886.235 C116.013,883.76 113.333,882 110,882 C105.306,882 102,886.036 102,890.438 C102,892.799 102.967,894.499 104.026,896.097 L116.459,911.003 C117.854,912.312 118.118,912.312 119.513,911.003 L131.974,896.097 C133.22,894.499 134,892.799 134,890.438 C134,886.036 130.694,882 126,882' id='heart-like' sketch:type='MSShapeGroup'>
                </path>
            </g>
        </g>
    </svg>`;
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

const displayFiltersList = () => {
	const displayFiltersListButton = document.querySelector('#sort-button');
	const sortFiltersList = document.querySelector('#sort-filters');

	displayFiltersListButton.addEventListener('click', () => {
		displayFiltersListButton.classList.toggle('returned-button');
		sortFiltersList.classList.toggle('displayed-list');
	});
};

const contentContainer = document.querySelector('.media-modal-content');
const closeButton = document.querySelector('#media-close-button');
const prevButton = document.querySelector('#media-prev-button');
const nextButton = document.querySelector('#media-next-button');

const modalImg = document.createElement('img');
const modalVideo = document.createElement('video');

const displayMediaModalContent = (id, media, photographerName) => {
	const displayedMedia = media.find((med) => med.id === id);
	const index = media.indexOf(displayedMedia);

	const imgPath = `../../assets/photographers/${formatName(photographerName)}/${
		displayedMedia.image
	}`;
	const videoPath = `../../assets/photographers/${formatName(
		photographerName
	)}/${displayedMedia.video}`;

	if (displayedMedia.image) {
		modalImg.src = imgPath;
		modalImg.alt = displayedMedia.title;
		modalImg.classList.add('displayed-media');
		contentContainer.appendChild(modalImg);
	}

	if (displayedMedia.video) {
		modalVideo.src = videoPath;
		modalVideo.type = 'video/mp4';
		modalVideo.classList.add('displayed-media');
		modalVideo.setAttribute('controls', true);
		contentContainer.appendChild(modalVideo);
	}
};

const openMediaModal = (e, media, photographerName) => {
	const modal = document.getElementById('media-modal-overlay');
	modal.style.display = 'block';

	displayMediaModalContent(Number(e.target.id), media, photographerName);
};

const scrollMedia = (e, media, photographerName, direction) => {
	const displayedMedia = media.find((med) => med.id === e.target.id);
	const index = media.indexOf(displayedMedia);

	const prevIndex = index === 0 ? media.length : index - 1;
	const nextIndex = index === media.length ? 0 : index + 1;

	if (direction === -1) {
		const id = media[prevIndex].id;
		displayMediaModalContent(id, media, photographerName);
	}
	if (direction === 1) {
		const id = media[nextIndex].id;
		displayMediaModalContent(id, media, photographerName);
	}
};

const closeMediaModal = () => {
	const modal = document.getElementById('media-modal-overlay');
	modal.style.display = 'none';
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

	// display media with the template
	const mediaContainer = document.querySelector('#medias');

	displayFiltersList();

	media.forEach((photo) => {
		const mediaModel = mediaTemplate(photo, name);
		const mediaCardDOM = mediaModel.getMediaCardDOM();
		mediaContainer.appendChild(mediaCardDOM);
	});

	// display info box with likes and price
	const main = document.querySelector('main');
	main.appendChild(displayInfoBox(media, price));

	// display photographer name in the contact modal
	const modalTitle = document.querySelector('#modal-title');
	modalTitle.innerHTML += '<br>' + name;

	// Toggle media modal
	const mediaElts = document.querySelectorAll('.media');

	mediaElts.forEach((mediaElt) => {
		mediaElt.addEventListener('click', (e) => openMediaModal(e, media, name));
	});

	prevButton.addEventListener('click', (e) => scrollMedia(e, media, -1));
	nextButton.addEventListener('click', (e) => scrollMedia(e, media, 1));

	closeButton.addEventListener('click', closeMediaModal);
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
