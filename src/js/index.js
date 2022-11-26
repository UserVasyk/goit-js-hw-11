import '../css/index.css';
import Notiflix from 'notiflix';
import refs from './refs.js';
import { fetchResult } from './fetchResult.js';

refs.searchForm.addEventListener('submit', onSearchFormSubmit);

function onSearchFormSubmit(evt) {
  evt.preventDefault();
  const searchValue = refs.inputValue.value;

  fetchResult(searchValue.trim()).then(data => {
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

    console.log(data.hits);
    console.log('data.hits: ', data.hits);
    renderResult(data.hits);
  });
}

function renderResult(values) {
  return values.map(value => {
    const {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = value;
    const markup = `<div class="photo-card">
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
</div>`;
    return refs.galleryBox.insertAdjacentHTML('beforeend', markup);
  });
}
