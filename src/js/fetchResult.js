function fetchResult(searchValue) {
  const KEY_API = '31614064-86118f7eefeef0715fa695b82';
  const mainUrl = 'https://pixabay.com/api/';
  const options = {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  return fetch(`${mainUrl}?key=${KEY_API}&q=${searchValue}`, options).then(
    response => response.json()
  );
}

export { fetchResult };
