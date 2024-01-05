import { createMedia, mediaTemplate } from '../templates/media.js';
import contactFormModal from '../utils/contactForm.js';
import { focusTrap, cancelFocusTrap } from '../helpers/focusTrap.js';
import heartIconComponent from '../components/heartIcon.js';

const toggleFiltersButton = document.querySelector('#sort-button');
const sortFiltersListContainer = document.querySelector(
  '#sort-filters-container',
);
let sortFiltersArray = ['popularity', 'date', 'title'];
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
const id = Number(params.get('id'));

const getPhotographer = async () => {
  try {
    const response = await fetch('../../data/photographers.json');
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    return error;
  }
};

const calculateTotalCountOfLikes = (media) => {
  let total = 0;
  media.forEach((mediaItem) => {
    total += mediaItem.likes;
  });
  return total;
};

const incrementLikes = (e, mediaItem, mediaCardDOM) => {
  const newLikesCount = (mediaItem.likes + 1);
  totalLikesCount += 1;
  mediaCardDOM.querySelector('.likes-count').textContent = newLikesCount;
  document.querySelector('.total-likes').textContent = totalLikesCount;

  e.target.closest('svg').classList.remove('likes-button');
  e.target.closest('svg').style.opacity = '0.5';
  e.target.closest('svg').style.pointerEvents = 'none';
};

const displaySelectedMediaInModal = (
  mediaToDisplay,
  isDisplayedInModal,
  eltToInsertBefore,
) => {
  const mediaModel = mediaTemplate(mediaToDisplay, isDisplayedInModal);
  const mediaCardDOM = mediaModel.getMediaCardDOM();

  if (currentMedia) {
    currentMedia.remove();
  }

  currentMedia = mediaCardDOM;
  eltToInsertBefore.parentNode.insertBefore(
    mediaCardDOM,
    eltToInsertBefore.nextSibling,
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

const scrollMedia = (currentIndex, media, direction) => {
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

const displayMedias = (media) => {
  totalLikesCount = calculateTotalCountOfLikes(media);

  media.forEach((mediaItem) => {
    const mediaModel = mediaTemplate(mediaItem, false);
    const mediaCardDOM = mediaModel.getMediaCardDOM();
    mediaContainer.appendChild(mediaCardDOM);

    mediaCardDOM.addEventListener('click', (e) => {
      if (
        e.target.closest('svg') && e.target.closest('svg').classList.contains('likes-button')
      ) {
        incrementLikes(e, mediaItem, mediaCardDOM);
      }
      openMediaModal(e, media);
    });
    mediaCardDOM.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        openMediaModal(e, media);
      }
      if (e.target.classList.contains('likes-button') && e.key === 'Enter') {
        incrementLikes(e, mediaItem, mediaCardDOM);
      }
    });
  });
};

const displayTotalLikes = () => {
  const totalLikesDiv = document.createElement('div');
  totalLikesDiv.classList.add('total-likes-container');

  const totalLikesCountDiv = document.createElement('span');
  totalLikesCountDiv.classList.add('total-likes');

  totalLikesCountDiv.textContent = totalLikesCount;
  totalLikesDiv.appendChild(totalLikesCountDiv);
  totalLikesDiv.appendChild(heartIconComponent('#000'));

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

const displayFilters = (filtersList) => {
  sortFiltersList.innerHTML = '';
  filtersList.forEach((filterItem) => {
    const li = document.createElement('li');
    li.classList.add('sort-filters-option');
    li.id = `sort-${filterItem}`;
    li.tabindex = '0';
    li.role = 'option';
    let filterItemValue;
    if (filterItem === 'popularity') {
      filterItemValue = 'Popularité';
    } else if (filterItem === 'date') {
      filterItemValue = 'Date';
    } else if (filterItem === 'title') {
      filterItemValue = 'Titre';
    }
    li.textContent = filterItemValue;
    sortFiltersList.appendChild(li);
  });
};

const toggleFiltersList = () => {
  toggleFiltersButton.classList.toggle('returned-button');
  if (toggleFiltersButton.getAttribute('aria-expanded') === 'false') {
    toggleFiltersButton.setAttribute('aria-expanded', 'true');
  } else {
    toggleFiltersButton.setAttribute('aria-expanded', 'false');
  }

  if (sortFiltersListContainer.classList.contains('displayed-list')) {
    sortFiltersListContainer.classList.remove('displayed-list');
    sortFiltersList.setAttribute('aria-hidden', 'true');
  } else {
    sortFiltersList.style.transform = 'translateY(0)';

    setTimeout(() => {
      sortFiltersListContainer.classList.add('displayed-list');
    }, 100);

    sortFiltersList.setAttribute('aria-hidden', 'false');
  }
  activeFiltersOptions.forEach((filter) => filter.classList.toggle('no-clickable'));

  focusTrap(document.querySelector('.sort-filters-container'));
};

const sortMedias = (media, filter) => {
  let sortFunction;

  if (filter.tagName === 'LI') {
    const filterId = filter.id;

    switch (filterId) {
      case 'sort-popularity':
        sortFunction = (a, b) => b.likes - a.likes;
        sortFiltersArray = ['popularity', 'date', 'title'];
        break;
      case 'sort-date':
        sortFunction = (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime();
        sortFiltersArray = ['date', 'title', 'popularity'];
        break;
      case 'sort-title':
        sortFunction = (a, b) => a.title.localeCompare(b.title, 'en', { ignorePunctuation: true });
        sortFiltersArray = ['title', 'popularity', 'date'];
        break;
      default:
    }

    mediaContainer.innerHTML = '';
    displayMedias(media.sort(sortFunction));
    displayFilters(sortFiltersArray);
    cancelFocusTrap(document.querySelector('.sort-filters'));
    toggleFiltersList();
  }
};

const sortMediasEvent = (media) => {
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
    sortMedias(media, filter);
  });

  sortFiltersList.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const filter = e.target;
      sortMedias(media, filter);
    }
  });
};

const displayPhotographerData = async (photographer, media) => {
  const {
    name, city, country, tagline, price, portrait,
  } = photographer;

  document.title = `Fisheye - ${name}`;

  // display photographer's banner
  const banner = document.querySelector('.photograph-header');

  const picture = `assets/photographers/${portrait}`;
  const photographerImg = document.createElement('img');
  photographerImg.src = picture;
  photographerImg.alt = name;

  banner.prepend(displayPhotographerDescription(name, tagline, city, country));
  banner.appendChild(photographerImg);

  contactFormModal();

  // display filters
  displayFilters(sortFiltersArray);

  if (toggleFiltersButton.getAttribute('aria-expanded') === 'false') {
    activeFiltersOptions.forEach((filter) => filter.classList.add('no-clickable'));
  }

  toggleFiltersButton.addEventListener('click', () => {
    toggleFiltersList();
  });

  toggleFiltersButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      toggleFiltersList();
    }
  });

  sortMediasEvent(media);
  displayMedias(media);

  // display info box with likes and price
  const main = document.querySelector('main');
  main.appendChild(displayInfoBox(price));

  // display photographer name in the contact modal
  const modalTitle = document.querySelector('#modal-title');
  modalTitle.innerHTML += `<br>${name}`;

  // Change media in modal
  prevButton.addEventListener('click', () => scrollMedia(index, media, -1));
  prevButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      scrollMedia(index, media, -1);
    }
  });
  mediaModal.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      scrollMedia(index, media, -1);
    }
  });
  nextButton.addEventListener('click', () => scrollMedia(index, media, 1));
  nextButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      scrollMedia(index, media, 1);
    }
  });
  mediaModal.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      scrollMedia(index, media, 1);
    }
  });

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

  const photographerMedia = media.filter((m) => m.photographerId === id);

  const formattedMedia = photographerMedia.map(
    (mediaItem) => createMedia(mediaItem, photographerData.name),
  );

  displayPhotographerData(photographerData, formattedMedia);
};
init();
