import '../css/index.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import refs from './refs.js';
import { fetchImages } from './fetchImages.js';

let page = 1;
let searchValue = '';
let searchData = '';

refs.inputValue.addEventListener('input', getInputValues);
refs.searchForm.addEventListener('submit', onSearchFormSubmit);
const loadImages = (page = 1) => {
  fetchImages(searchValue.trim(), page)
    .then(({ data }) => {
      const totalHits = data.totalHits;
      if (page === 1) {
        if (totalHits === 0) {
          return Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.',
            {
              timeout: 2500,
              clickToClose: true,
            }
          );
        } else {
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
          if (data.total > 8) {
            refs.loadingGif.classList.remove('hidden');
          }
        }
      }
      if (data.hits.length === 0) {
        refs.loadingGif.classList.add('hidden');
        return Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results.",
          {
            timeout: 2500,
          }
        );
      }
      refs.galleryBox.insertAdjacentHTML('beforeend', renderResult(data.hits));
      simpleLightbox.refresh();

      const lastCard = refs.galleryBox.lastChild;
      if (lastCard) {
        infinitiveScroll.observe(lastCard);
      }
    })
    .catch(error => console.log(error));
};
const simpleLightbox = new SimpleLightbox('.gallery-item');
function getInputValues(evt) {
  searchValue = evt.currentTarget.value;
  searchData = evt.data;
}
function onSearchFormSubmit(evt) {
  evt.preventDefault();
  refs.loadingGif.classList.add('hidden');

  refs.galleryBox.innerHTML = '';
  if (searchValue === '' || searchData === ' ') {
    return Notiflix.Notify.warning("We're sorry, but type something", {
      timeout: 2500,
    });
  }

  loadImages();

  evt.target.reset();
}
function renderResult(values) {
  return values
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
<div class="photo-card-box"><a class="gallery-item" href="${largeImageURL}">
  <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a></div>
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
</div>`
    )
    .join('');
}

const infinitiveScroll = new IntersectionObserver(([entry], observer) => {
  if (entry.isIntersecting) {
    observer.unobserve(entry.target);

    loadImages((page += 1));
    console.log(page);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
});
