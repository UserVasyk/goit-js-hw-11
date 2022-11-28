async function fetchImages(searchValue, page) {
  const KEY_API = '31614064-86118f7eefeef0715fa695b82';
  const BASE_URL = 'https://pixabay.com/api/';

  const fetchImages = await fetch(
    `${BASE_URL}?key=${KEY_API}&q=${searchValue}&image_type=photo&safesearch=true&orientation=horizontal&page=${page}&per_page=16`
  );
  if (!fetchImages.ok) {
    throw new Error();
  }
  const response = await fetchImages.json();
  return response;
}

export { fetchImages };
