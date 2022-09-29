const galleryList = document.querySelector('.gallery');

function renderCard(photos) {
  const markup = photos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <a class="gallery__item" href="${largeImageURL}">
            <div class="photo-card">
                <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width="370" height="270" />
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>
                        <span>${likes}</span>
                    </p>
                    <p class="info-item">
                        <b>Views</b>
                        <span>${views}</span>
                    </p>
                    <p class="info-item">
                        <b>Comments</b>
                        <span>${comments}</span>
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>
                        <span>${downloads}</span>
                    </p>
                </div>
            </div>
        </a>`;
      }
    )
    .join('');
  galleryList.insertAdjacentHTML('beforeend', markup);
}

export { renderCard };
