import '../css/index.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import throttle from 'lodash.throttle';
import refs from './refs.js';
import { fetchImages } from './fetchImages.js';

let page = 0;
let searchValue = '';
let searchData = '';

refs.inputValue.addEventListener('input', getInputValues);
refs.searchForm.addEventListener('submit', onSearchFormSubmit);

const simpleLightbox = new SimpleLightbox('.gallery-item');
function getInputValues(evt) {
  searchValue = evt.currentTarget.value;
  searchData = evt.data;
}
function onSearchFormSubmit(evt) {
  evt.preventDefault();
  refs.loadingGif.classList.add('hidden');
  page = 0;
  refs.galleryBox.innerHTML = '';
  if (searchValue === '' || searchData === ' ') {
    return Notiflix.Notify.warning("We're sorry, but type something", {
      timeout: 2500,
    });
  }

  page += 1;
  fetchImages(searchValue.trim(), page)
    .then(data => {
      const totalHits = data.totalHits;
      if (totalHits === 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            timeout: 2500,
            clickToClose: true,
          }
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
        if (data.total > 8) {
          refs.loadingGif.classList.remove('hidden');
        }
      }

      refs.galleryBox.insertAdjacentHTML('beforeend', renderResult(data.hits));
      simpleLightbox.refresh();
    })
    .catch(error => console.log(error));
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
  <a class="gallery-item" href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views${views}</b>
    </p>
    <p class="info-item">
      <b>Comments${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
}

window.addEventListener('scroll', throttle(infinitiveScroll, 250));

function infinitiveScroll() {
  const documentGetRect = document.documentElement.getBoundingClientRect();
  const documentClientHeight = document.documentElement.clientHeight;
  if (documentGetRect.bottom < documentClientHeight + 200) {
    page += 1;
    fetchImages(searchValue.trim(), page).then(data => {
      if (data.hits.length === 0) {
        refs.loadingGif.classList.add('hidden');
        return Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results.",
          {
            timeout: 2500,
          }
        );
      }

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      refs.galleryBox.insertAdjacentHTML('beforeend', renderResult(data.hits));
      simpleLightbox.refresh();
    });
  }
}
