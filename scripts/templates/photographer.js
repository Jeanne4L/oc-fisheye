const photographerTemplate = (photographer) => {
  const {
    name, id, city, country, tagline, price, portrait,
  } = photographer;

  const picture = `assets/photographers/${portrait}`;

  const getUserCardDOM = () => {
    const article = document.createElement('article');
    const img = document.createElement('img');

    const link = document.createElement('a');
    link.href = `photographer.html?id=${id}`;
    link.setAttribute('aria-label', `Voir la page de ${name}`);

    img.src = picture;
    img.alt = name;
    img.loading = 'lazy';

    const h2 = document.createElement('h2');
    h2.textContent = name;

    const location = document.createElement('h3');
    location.textContent = `${city}, ${country}`;
    location.classList.add('location');

    const tagLine = document.createElement('p');
    tagLine.textContent = tagline;
    tagLine.classList.add('tagline');

    const tariff = document.createElement('span');
    tariff.textContent = `${price}€/jour`;
    tariff.classList.add('tariff');

    article.appendChild(link);
    link.appendChild(img);
    link.appendChild(h2);
    article.appendChild(location);
    article.appendChild(tagLine);
    article.appendChild(tariff);

    return article;
  };
  return { photographer, getUserCardDOM };
};

export default photographerTemplate;
