import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';
import { renderCard } from './renderCard';

const form = document.querySelector('#search-form');
const galleryList = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');
let page = 2;
let query = '';
let gallery;
let isLoading = false;

form.addEventListener('submit', onSearch);
async function onSearch(event) {
  event.preventDefault();
  galleryList.innerHTML = '';

  const { searchQuery } = event.currentTarget.elements;
  query = searchQuery.value;

  //   buttonLoadMore.classList.add('is-hiden');
  const { totalHits, hits } = await fetchImages(query, 1);
  if (hits.length === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  renderCard(hits);
  //   buttonLoadMore.classList.remove('is-hiden');
  gallery = new SimpleLightbox('.gallery a');
  return Notify.success(`Hooray! We found ${totalHits} images.`);
}

buttonLoadMore.addEventListener('click', async () => {
  const { totalHits, hits } = await fetchImages(query, page);
  renderCard(hits);
  gallery.refresh();
  page += 1;

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
});

const handleScroll = async () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  const endOfPage =
    window.innerHeight + window.pageYOffset + cardHeight >=
    document.body.offsetHeight;

  if (endOfPage && !isLoading) {
    isLoading = true;
    try {
      const { totalHits, hits } = await fetchImages(query, page);
      renderCard(hits);
      gallery.refresh();
      page += 1;
    } finally {
      isLoading = false;
    }
  }
};

let throttleWait = false;
const throttle = (callback, time) => {
  if (throttleWait) return;
  throttleWait = true;

  setTimeout(() => {
    callback();
    throttleWait = false;
  }, time);
};

window.addEventListener('scroll', () => {
  throttle(handleScroll, 250);
});
