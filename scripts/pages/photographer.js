import { createMedia, mediaTemplate } from '../templates/media.js';
import displayContactModal from '../utils/contactForm.js';
import { focusTrap, cancelFocusTrap } from '../helpers/focusTrap.js';
import heartIconComponent from '../components/heartIcon.js';

const filtersButton = document.querySelector('#sort-button');
const filtersContainer = document.querySelector('#filters-list-container');
const filtersListElement = document.querySelector('#filters-list');
const mediaContainer = document.querySelector('#medias');
const mediaModal = document.getElementById('media-modal-overlay');
const closeButton = document.querySelector('#media-close-button');
const prevButton = document.querySelector('#media-prev-button');
const nextButton = document.querySelector('#media-next-button');
let filters = null;
let filtersArray = ['popularity', 'date', 'title'];
let clickedMedia = null;
let currentMedia = null;
let totalLikesCount = 0;
let index;

// Get id in url
const params = new URL(document.location).searchParams;
const id = Number(params.get('id'));

const getPhotographer = async () => {
  try {
    const response = await fetch('https://jeanne4l.github.io/oc-fisheye/data/photographers.json');
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    return error;
  }
};

const calculateTotalLikesCount = (media) => {
  let total = 0;
  media.forEach((mediaItem) => {
    total += mediaItem.likes;
  });
  return total;
};

const incrementLikesCount = (e, mediaItem, mediaElement) => {
  const newLikesCount = (mediaItem.likes + 1);
  totalLikesCount += 1;
  mediaElement.querySelector('.likes-count').textContent = newLikesCount;
  document.querySelector('.total-likes').textContent = totalLikesCount;

  e.target.closest('svg').classList.remove('likes-button');
  e.target.closest('svg').style.opacity = '0.5';
  e.target.closest('svg').style.pointerEvents = 'none';
};

const displaySelectedMediaInModal = (
  mediaToDisplay,
  isDisplayedInModal,
  insertBeforeElement,
) => {
  const mediaModel = mediaTemplate(mediaToDisplay, isDisplayedInModal);
  const mediaElement = mediaModel.getmediaElement();

  if (currentMedia) {
    currentMedia.remove();
  }

  currentMedia = mediaElement;
  insertBeforeElement.parentNode.insertBefore(
    mediaElement,
    insertBeforeElement.nextSibling,
  );
};

const openMediaModal = (e, media) => {
  if (e.target.classList.contains('media')) {
    clickedMedia = e.target;

    e.preventDefault();

    mediaModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    mediaModal.setAttribute('aria-hidden', 'false');

    const displayedMedia = media.find((med) => med.id === Number(e.target.id));
    index = media.indexOf(displayedMedia);

    displaySelectedMediaInModal(displayedMedia, true, prevButton);

    closeButton.focus();

    focusTrap(document.querySelector('.media-modal'));
  }
};

const navigateMediaInModal = (currentIndex, media, direction) => {
  currentIndex = (currentIndex + direction + media.length) % media.length;

  const mediaToDisplay = media[currentIndex];

  index = currentIndex;

  displaySelectedMediaInModal(mediaToDisplay, true, prevButton);
};

const closeMediaModal = () => {
  mediaModal.style.display = 'none';
  document.body.style.overflow = 'visible';
  mediaModal.setAttribute('aria-hidden', 'true');

  cancelFocusTrap(document.querySelector('.media-modal'));

  if (clickedMedia) {
    setTimeout(() => {
      clickedMedia.focus();
    }, 0);
  }
};

const displayMediaGallery = (media) => {
  totalLikesCount = calculateTotalLikesCount(media);

  media.forEach((mediaItem) => {
    const mediaModel = mediaTemplate(mediaItem, false);
    const mediaElement = mediaModel.getmediaElement();
    mediaContainer.appendChild(mediaElement);

    mediaElement.addEventListener('click', (e) => {
      if (
        e.target.closest('svg') && e.target.closest('svg').classList.contains('likes-button')
      ) {
        incrementLikesCount(e, mediaItem, mediaElement);
      }
      openMediaModal(e, media);
    });
    mediaElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        openMediaModal(e, media);
      }
      if (e.target.classList.contains('likes-button') && e.key === 'Enter') {
        incrementLikesCount(e, mediaItem, mediaElement);
      }
    });
  });
};

const displayTotalLikesCount = () => {
  const totalLikesContainer = document.createElement('div');
  totalLikesContainer.classList.add('total-likes-container');

  const totalLikesCountSpan = document.createElement('span');
  totalLikesCountSpan.classList.add('total-likes');

  totalLikesCountSpan.textContent = totalLikesCount;
  totalLikesContainer.appendChild(totalLikesCountSpan);
  totalLikesContainer.appendChild(heartIconComponent('#000'));

  return totalLikesContainer;
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

  infoBox.appendChild(displayTotalLikesCount());
  infoBox.appendChild(tariff);

  return infoBox;
};

const displayFilters = (filtersList) => {
  const filterLocale = {
    popularity: 'Popularité',
    date: 'Date',
    title: 'Titre',
  };

  filtersListElement.innerHTML = '';

  filtersList.forEach((filter) => {
    const li = document.createElement('li');

    li.classList.add('filters-list-option');
    li.id = `sort-${filter}`;
    li.setAttribute('tabindex', '0');
    li.role = 'option';

    const filterValue = filterLocale[filter];
    li.textContent = filterValue;

    filtersListElement.appendChild(li);
  });

  filters = document.querySelectorAll('.filters-list-option');
};

const toggleFiltersList = () => {
  filtersButton.classList.toggle('returned-button');
  if (filtersButton.getAttribute('aria-expanded') === 'false') {
    filtersButton.setAttribute('aria-expanded', 'true');
  } else {
    filtersButton.setAttribute('aria-expanded', 'false');
  }

  if (filtersContainer.classList.contains('displayed-list')) {
    filtersContainer.classList.remove('displayed-list');
    filtersListElement.setAttribute('aria-hidden', 'true');

    filters.forEach((filter) => {
      filter.classList.toggle('no-clickable');
      filter.setAttribute('tabindex', '-1');
    });

    cancelFocusTrap(document.querySelector('.filters-list'));
  } else {
    filtersContainer.classList.add('displayed-list');

    filtersListElement.setAttribute('aria-hidden', 'false');

    filters.forEach((filter) => {
      filter.classList.toggle('no-clickable');
      filter.setAttribute('tabindex', '0');
    });

    focusTrap(document.querySelector('.filters-list-container'));
  }
};

const sortMedias = (media, filter) => {
  let sortFunction;

  if (filter.tagName === 'LI') {
    const filterId = filter.id;

    switch (filterId) {
      case 'sort-popularity':
        sortFunction = (a, b) => b.likes - a.likes;
        filtersArray = ['popularity', 'date', 'title'];
        break;
      case 'sort-date':
        sortFunction = (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime();
        filtersArray = ['date', 'title', 'popularity'];
        break;
      case 'sort-title':
        sortFunction = (a, b) => a.title.localeCompare(b.title, 'en', { ignorePunctuation: true });
        filtersArray = ['title', 'popularity', 'date'];
        break;
      default:
    }

    mediaContainer.innerHTML = '';
    displayMediaGallery(media.sort(sortFunction));
    displayFilters(filtersArray);
    toggleFiltersList();
  }
};

const applySortMediaEvents = (media) => {
  filters.forEach((filter) => {
    filter.addEventListener('focus', (e) => {
      const selectedFilter = e.target;
      selectedFilter.setAttribute('aria-selected', 'true');
    });

    filter.addEventListener('blur', (e) => {
      const selectedFilter = e.target;
      selectedFilter.setAttribute('aria-selected', 'false');
    });
  });

  filtersListElement.addEventListener('click', (e) => {
    const selectedFilter = e.target;
    sortMedias(media, selectedFilter);
  });

  filtersListElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const selectedFilter = e.target;
      sortMedias(media, selectedFilter);
    }
  });
};

const applyNavigateMediaInModalEvents = (media) => {
  prevButton.addEventListener('click', () => navigateMediaInModal(index, media, -1));
  prevButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      navigateMediaInModal(index, media, -1);
    }
  });
  mediaModal.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      navigateMediaInModal(index, media, -1);
    }
  });
  nextButton.addEventListener('click', () => navigateMediaInModal(index, media, 1));
  nextButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      navigateMediaInModal(index, media, 1);
    }
  });
  mediaModal.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      navigateMediaInModal(index, media, 1);
    }
  });
};

const displayPageData = async (photographer, media) => {
  const {
    name, city, country, tagline, price, portrait,
  } = photographer;

  document.title = `Fisheye - ${name}`;

  // display photographer's banner
  const banner = document.querySelector('.photograph-banner');

  const photographerImgUrl = `assets/photographers/${portrait}`;
  const photographerImg = document.createElement('img');
  photographerImg.src = photographerImgUrl;
  photographerImg.alt = name;

  banner.prepend(displayPhotographerDescription(name, tagline, city, country));
  banner.appendChild(photographerImg);

  //   display contact modal
  displayContactModal();
  const modalTitle = document.querySelector('#modal-title');
  modalTitle.innerHTML += `<br>${name}`;

  // display filters list
  displayFilters(filtersArray);

  if (filtersButton.getAttribute('aria-expanded') === 'false') {
    filters.forEach((filter) => filter.classList.add('no-clickable'));
  }

  filtersButton.addEventListener('click', () => {
    toggleFiltersList();
  });

  filtersButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      toggleFiltersList();
    }
  });

  displayMediaGallery(media.sort((a, b) => b.likes - a.likes));
  applySortMediaEvents(media);

  // display info box with likes and price
  const main = document.querySelector('main');
  main.appendChild(displayInfoBox(price));

  applyNavigateMediaInModalEvents(media);

  closeButton.addEventListener('click', closeMediaModal);
  closeButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      closeMediaModal();
    }
  });
};

const init = async () => {
  const { photographers, media } = await getPhotographer();

  const photographerData = photographers.find(
    (photographer) => photographer.id === id,
  );

  const photographerMedia = media.filter((mediaItem) => mediaItem.photographerId === id);

  const mediaWithPhotographerName = photographerMedia.map(
    (mediaItem) => createMedia(mediaItem, photographerData.name),
  );

  displayPageData(photographerData, mediaWithPhotographerName);
};
init();
