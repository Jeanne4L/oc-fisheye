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

const displayPhotographerData = async (photographer, media) => {
	const { name, id, city, country, tagline, price, portrait } = photographer;

	document.title = `Fisheye - ${name}`;
	const picture = `assets/photographers/${portrait}`;

	const banner = document.querySelector('.photograph-header');
	const mediaContainer = document.querySelector('#medias');

	const photographerDescription = document.createElement('div');

	const nameH1 = document.createElement('h1');
	nameH1.textContent = name;

	const location = document.createElement('h2');
	location.textContent = `${city}, ${country}`;
	location.classList.add('location');

	const tagLine = document.createElement('p');
	tagLine.textContent = tagline;
	tagLine.classList.add('tagline');

	const img = document.createElement('img');
	img.src = picture;
	img.alt = name;

	const tariff = document.createElement('span');
	tariff.textContent = `${price}€/jour`;
	tariff.classList.add('tariff');

	banner.prepend(photographerDescription);
	photographerDescription.appendChild(nameH1);
	photographerDescription.appendChild(location);
	photographerDescription.appendChild(tagLine);
	banner.appendChild(img);

	media.forEach((photo) => {
		const mediaModel = mediaTemplate(photo, name);
		const mediaCardDOM = mediaModel.getMediaCardDOM();
		mediaContainer.appendChild(mediaCardDOM);
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

const displayFiltersListButton = document.querySelector('#sort-button');
const sortFiltersList = document.querySelector('#sort-filters');

displayFiltersListButton.addEventListener('click', () => {
	displayFiltersListButton.classList.toggle('returned-button');
	sortFiltersList.classList.toggle('displayed-list');
});
