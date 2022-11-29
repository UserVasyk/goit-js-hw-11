import axios from 'axios';
async function fetchImages(searchValue, page) {
  const KEY_API = '31614064-86118f7eefeef0715fa695b82';
  const BASE_URL = 'https://pixabay.com/api/';
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const fetchImages = await axios.get(
    `${BASE_URL}?key=${KEY_API}&q=${searchValue}&image_type=photo&safesearch=true&orientation=horizontal&page=${page}&per_page=16`,
    options
  );

  return fetchImages;
}

export { fetchImages };
