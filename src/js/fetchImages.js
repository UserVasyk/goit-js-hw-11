function fetchImages(searchValue, page) {
  const KEY_API = '31614064-86118f7eefeef0715fa695b82';
  const BASE_URL = 'https://pixabay.com/api/';

  return fetch(
    `${BASE_URL}?key=${KEY_API}&q=${searchValue}&image_type=photo&safesearch=true&orientation=horizontal&page=${page}&per_page=12`
  ).then(response => {
    if (!response.ok) {
      throw new Error();
    }

    return response.json();
  });
}

export { fetchImages };
