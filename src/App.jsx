import { useEffect, useState } from 'react';
import { Layout } from 'App.styled';
import fetchAPI from 'serviceAPI/serviceAPI';
import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Loader from 'components/Loader/Loader';
import Button from 'components/Button/Button';
import Modal from 'components/Modal/Modal';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState(null);
  const [imagesOnPage, setImagesOnPage] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [currentImageTag, setCurrentImageTag] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);

      fetchAPI(query, page)
        .then(({ hits, totalHits }) => {
          const array = hits.map(hit => ({
            id: hit.id,
            tag: hit.tags,
            smallImage: hit.webformatURL,
            largeImage: hit.largeImageURL,
          }));

          if (!totalHits) {
            alert(`Sorry, but there is no any data for ${query}`);
          }

          setImages(prevImages =>
            page === 1 ? array : [...prevImages, ...array]
          );

          setImagesOnPage(prevImagesOnPage =>
            page === 1 ? array.length : prevImagesOnPage + array.length
          );

          setTotalImages(totalHits);
        })
        .catch(error => {
          setError(error);
          setStatus('rejected');
        })
        .finally(() => setIsLoading(false));
    };
    if (query !== '') {
      fetchData();
    }
  }, [query, page]);

  const getResult = query => {
    setQuery(query);
    setPage(1);
  };

  const onLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const onToggleModal = () => {
    setShowModal(prevShowModal => !prevShowModal);
  };

  const onOpenModal = event => {
    const currentImageUrl = event.target.dataset.large;
    const currentImageTag = event.target.alt;

    if (event.target.nodeName === 'IMG') {
      setShowModal(prevShowModal => !prevShowModal);
      setCurrentImageUrl(currentImageUrl);
      setCurrentImageTag(currentImageTag);
    }
  };

  return (
    <Layout>
      <Searchbar onSubmit={getResult} />

      {isLoading && <Loader />}

      {images && <ImageGallery images={images} openModal={onOpenModal} />}

      {imagesOnPage >= 12 && imagesOnPage < totalImages && (
        <Button onLoadMore={onLoadMore} />
      )}

      {showModal && (
        <Modal
          onClose={onToggleModal}
          currentImageUrl={currentImageUrl}
          currentImageTag={currentImageTag}
        />
      )}
      {status === 'rejected' && <b error={error} />}
    </Layout>
  );
}
