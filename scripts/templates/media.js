import getFirstName from '../helpers/getFirstName.js';
import calculateMediaSizeWithRatio from '../helpers/calculateMediaSizeWithRatio.js';
import heartIconComponent from '../components/heartIcon.js';

export const mediaTemplate = (media, isDisplayedInModal) => {
  const { title, likes } = media;

  const getmediaElement = () => {
    const article = document.createElement('article');

    const mediaDescription = document.createElement('div');
    mediaDescription.classList.add('media-description');

    const mediaTitle = document.createElement('h3');
    mediaTitle.textContent = title;

    const mediaLikes = document.createElement('div');
    mediaLikes.classList.add('media-likes');
    const likesCount = document.createElement('span');
    likesCount.classList.add('likes-count');

    const likesIcon = heartIconComponent('#901c1c');
    likesIcon.setAttribute('tabindex', '0');
    likesIcon.setAttribute('role', 'button');
    likesIcon.classList.add('likes-button', 'likes-icon');

    const domElement = media.getDomElement();

    if (!isDisplayedInModal) {
      domElement.setAttribute('tabindex', '0');
      domElement.setAttribute('role', 'button');
    } else {
      if (window.screen.width > 600) {
        calculateMediaSizeWithRatio(domElement, 80);
      }

      if (domElement.tagName === 'VIDEO') {
        domElement.autoplay = true;
      }
    }

    article.appendChild(domElement);
    article.appendChild(mediaDescription);
    mediaDescription.appendChild(mediaTitle);

    if (!isDisplayedInModal) {
      likesCount.textContent = likes;

      mediaLikes.appendChild(likesCount);
      mediaLikes.appendChild(likesIcon);
      mediaDescription.appendChild(mediaLikes);
    }

    return article;
  };
  return { media, getmediaElement };
};

const createImageElement = (media, photographerName) => {
  const img = document.createElement('img');
  img.src = `https://jeanne4l.github.io/oc-fisheye/assets/photographers/${getFirstName(
    photographerName,
  )}/${media.image}`;
  img.alt = media.title;
  img.id = media.id;
  img.classList.add('media');

  return img;
};

const createVideoElement = (media, photographerName) => {
  const video = document.createElement('video');
  video.src = `https://jeanne4l.github.io/oc-fisheye/assets/photographers/${getFirstName(
    photographerName,
  )}/${media.video}`;
  video.type = 'video/mp4';
  video.classList.add('media');
  video.id = media.id;

  video.controls = true;

  return video;
};

export const createMedia = (media, photographerName) => {
  let getDomElement;

  if (!media.image && !media.video) {
    throw new Error('Unknown media type');
  }
  if (media.image) {
    getDomElement = () => createImageElement(media, photographerName);
  }

  if (media.video) {
    getDomElement = () => createVideoElement(media, photographerName);
  }

  return { ...media, getDomElement };
};
