const URL = 'https://pixabay.com/api/';
const KEY = '33161979-56695e67461a6bb8d382238a0';
// const PER_PAGE = 12;

export default function fetchAPI(query, page = 1) {
  return fetch(
    `${URL}?q=${query}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`
  ).then(response => {
    return response.json();
  });
}
