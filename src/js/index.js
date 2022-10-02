import { GalleryImg } from './galleryObj';

const form = document.querySelector('#search-form');
const galleryList = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');
const toggleSwitch = document.querySelector('#switch');

let galleryObj = new GalleryImg();

form.addEventListener('submit', onSearch);
async function onSearch(event) {
  event.preventDefault();
  galleryList.innerHTML = '';
  const { searchQuery } = event.currentTarget.elements;

  buttonLoadMore.classList.add('is-hiden');

  await galleryObj.search(searchQuery.value);

  if (!checked) {
    buttonLoadMore.classList.remove('is-hiden');
  }
}

buttonLoadMore.addEventListener('click', async () => {
  await galleryObj.nextPage();
  if (galleryObj.endLoad) {
    buttonLoadMore.classList.add('is-hiden');
  }
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
    .firstElementChild?.getBoundingClientRect();

  const endOfPage =
    window.innerHeight + window.pageYOffset + cardHeight >=
    document.body.offsetHeight;

  if (endOfPage) {
    galleryObj.nextPage();
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

window.addEventListener('scroll', onScroll);
function onScroll() {
  throttle(handleScroll, 250);
}

let checked = toggleSwitch.checked;
toggleSwitch.addEventListener('change', event => {
  checked = event.target.checked;
  if (!checked) {
    window.removeEventListener('scroll', onScroll);
    if (galleryObj.page > 1) {
      buttonLoadMore.classList.remove('is-hiden');
    }
  } else {
    handleScroll();
    window.addEventListener('scroll', onScroll);
    buttonLoadMore.classList.add('is-hiden');
  }
});
