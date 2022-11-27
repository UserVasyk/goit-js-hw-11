import '../css/index.css';
import Notiflix from 'notiflix';
import refs from './refs.js';
import { fetchImages } from './fetchImages.js';
refs.inputValue.addEventListener('input', getInputValues);
refs.searchForm.addEventListener('submit', onSearchFormSubmit);
let page = 0;
let searchValue = '';
let searchData = '';
function getInputValues(evt) {
  searchValue = evt.currentTarget.value;
  searchData = evt.data;
}
function onSearchFormSubmit(evt) {
  evt.preventDefault();
  console.log(searchValue);
  console.log(searchData);

  if (searchValue === '' || searchData === ' ') {
    return;
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
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }

      refs.galleryBox.insertAdjacentHTML('beforeend', renderResult(data.hits));
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
  <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
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
