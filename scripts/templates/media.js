import formatNameToFileName from '../helpers/formatNameToFileName.js';
import calculateMediaSizeWithRatio from '../helpers/calculateMediaSizeWithRatio.js';
import heartIconComponent from '../components/heartIcon.js';

export const mediaTemplate = (media, isDisplayedInModal) => {
  const { title, likes } = media;

  const getMediaCardDOM = () => {
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
    likesIcon.classList.add('likes-button');

    const { domElt } = media;

    if (!isDisplayedInModal) {
      domElt.setAttribute('tabindex', '0');
      domElt.setAttribute('role', 'button');
    } else {
      calculateMediaSizeWithRatio(domElt, 80);

      if (domElt.tagName === 'VIDEO') {
        domElt.autoplay = true;
      }
    }

    article.appendChild(domElt);
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
  return { media, getMediaCardDOM };
};

const createImageElt = (media, photographerName) => {
  const img = document.createElement('img');
  img.src = `../../assets/photographers/${formatNameToFileName(
    photographerName,
  )}/${media.image}`;
  img.alt = media.title;
  img.id = media.id;
  img.classList.add('media');

  return img;
};

const createVideoElt = (media, photographerName) => {
  const video = document.createElement('video');
  video.src = `../../assets/photographers/${formatNameToFileName(
    photographerName,
  )}/${media.video}`;
  video.type = 'video/mp4';
  video.classList.add('media');
  video.id = media.id;

  video.controls = true;

  return video;
};

export const createMedia = (media, photographerName) => {
  let domElt;

  if (!media.image && !media.video) {
    throw new Error('Unknown media type');
  }
  if (media.image) {
    domElt = createImageElt(media, photographerName);
  }

  if (media.video) {
    domElt = createVideoElt(media, photographerName);
  }

  return { ...media, domElt };
};
