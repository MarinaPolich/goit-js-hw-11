import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';
import { renderCard } from './renderCard';

export class GalleryImg {
  #searchQuery;
  #page = 1;
  #perPage;
  #isLoading = false;
  #gallery = new SimpleLightbox('.gallery a');
  #endLoad = false;
  get page() {
    return this.#page;
  }
  get endLoad() {
      return this.#endLoad;
  }

  constructor(perPage = 40) {
    this.#perPage = perPage;
  }

  async search(query) {
    this.#page = 1;
    this.#endLoad = false;
    this.#searchQuery = query;
    const { totalHits, hits } = await fetchImages(
      this.#searchQuery,
      this.#page,
      this.#perPage
    );
    if (hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    renderCard(hits);
    this.#gallery.refresh();
    this.#page++;
    return Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  async nextPage() {
    if (this.#isLoading || this.#endLoad) return;
    this.#isLoading = true;
    try {
      const { totalHits, hits } = await fetchImages(
        this.#searchQuery,
        this.#page,
        this.#perPage
      );
      renderCard(hits);
      this.#gallery.refresh();
      this.#page += 1;
      if (this.#page * this.#perPage >= totalHits) {
        this.#endLoad = true;
        Notify.info("We're sorry, but you've reached the end of search results.");
      }
    } finally {
      this.#isLoading = false;
    }
  }
}

// const galleryObj = {
//   page: 1,
//   perPage: 40,
//   query: '',
//   isLoading: false,
//   gallery: new SimpleLightbox('.gallery a'),
//   endLoad: false,
//   search: async function (query) {
//     this.page = 1;
//     this.endLoad = false;
//     this.query = query;
//     const { totalHits, hits } = await fetchImages(
//       this.query,
//       this.page,
//       this.perPage
//     );
//     if (hits.length === 0) {
//       return Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     }
//     renderCard(hits);
//     this.gallery.refresh();
//     this.page++;
//     return Notify.success(`Hooray! We found ${totalHits} images.`);
//   },
//   next: async function () {
//     if (this.isLoading || this.endLoad) return;
//     this.isLoading = true;
//     try {
//       const { totalHits, hits } = await fetchImages(
//         this.query,
//         this.page,
//         this.perPage
//       );
//       renderCard(hits);
//       this.gallery.refresh();
//       this.page += 1;
//       if (this.page * this.perPage >= totalHits) this.endLoad = true;
//     } finally {
//       this.isLoading = false;
//     }
//   },
// };

// export { galleryObj };
