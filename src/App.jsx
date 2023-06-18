import { Component } from 'react';
import { Layout } from 'App.styled';
import fetchAPI from 'serviceAPI/serviceAPI';
import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Loader from 'components/Loader/Loader';
import Button from 'components/Button/Button';
import Modal from 'components/Modal/Modal';

export default class App extends Component {
  state = {
    query: '',
    page: 1,
    images: null,
    imagesOnPage: 0,
    totalImages: 0,
    currentImageUrl: null,
    currentImageTag: null,
    isLoading: false,
    showModal: false,
    error: null,
  };

  componentDidUpdate(_, prevState) {
    const { query, page } = this.state;

    const fetchData = () => {
      this.setState(({ isLoading }) => ({ isLoading: !isLoading }));

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

          return this.setState(prevState => ({
            page: prevState.page === 1 ? 1 : prevState.page,
            images:
              prevState.page === 1 ? array : [...prevState.images, ...array],
            // imagesOnPage: array.length + prevState.imagesOnPage,
            // imagesOnPage: page < Math.ceil(totalHits / prevState.imagesOnPage),
            imagesOnPage:
              prevState.page === 1
                ? array.length
                : prevState.imagesOnPage + array.length,
            totalImages: totalHits,
          }));
        })
        .catch(error => this.setState({ error }))
        .finally(() =>
          this.setState(({ isLoading }) => ({ isLoading: !isLoading }))
        );
    };

    if (prevState.query !== query) {
      fetchData();
    }

    if (prevState.page !== page && page !== 1) {
      fetchData();
    }
  }

  // componentDidUpdate(_, prevState) {
  //   const { query, page } = this.state;

  //   if (prevState.query !== query) {
  //     this.setState(({ isLoading }) => ({ isLoading: !isLoading }));

  //     fetchAPI(query)
  //       .then(({ hits, totalHits }) => {
  //         const array = hits.map(hit => ({
  //           id: hit.id,
  //           tag: hit.tags,
  //           smallImage: hit.webformatURL,
  //           largeImage: hit.largeImageURL,
  //         }));

  //         if (!totalHits) {
  //           alert(`Sorry, but there is no any data for ${query}`);
  //         }

  //         return this.setState({
  //           page: 1,
  //           images: array,
  //           imagesOnPage: array.length,
  //           totalImages: totalHits,
  //         });
  //       })
  //       .catch(error => this.setState({ error }))
  //       .finally(() =>
  //         this.setState(({ isLoading }) => ({ isLoading: !isLoading }))
  //       );
  //   }

  //   if (prevState.page !== page && page !== 1) {
  //     this.setState(({ isLoading }) => ({ isLoading: !isLoading }));

  //     fetchAPI(query, page)
  //       .then(({ hits }) => {
  //         const array = hits.map(hit => ({
  //           id: hit.id,
  //           tag: hit.tags,
  //           smallImage: hit.webformatURL,
  //           largeImage: hit.largeImageURL,
  //         }));

  //         return this.setState(({ images, imagesOnPage }) => {
  //           return {
  //             images: [...images, ...array],
  //             imagesOnPage: array.length + imagesOnPage,
  //           };
  //         });
  //       })
  //       .catch(error => this.setState({ error }))
  //       .finally(() =>
  //         this.setState(({ isLoading }) => ({ isLoading: !isLoading }))
  //       );
  //   }
  // }

  getResult = query => {
    this.setState({ query, page: 1 });
  };

  onLoadMore = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  onToggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  onOpenModal = event => {
    const currentImageUrl = event.target.dataset.large;
    const currentImageTag = event.target.alt;

    if (event.target.nodeName === 'IMG') {
      this.setState(({ showModal }) => ({
        showModal: !showModal,
        currentImageUrl: currentImageUrl,
        currentImageTag: currentImageTag,
      }));
    }
  };

  render() {
    const {
      images,
      imagesOnPage,
      totalImages,
      currentImageUrl,
      currentImageTag,
      isLoading,
      showModal,
    } = this.state;

    const getResult = this.getResult;
    const onLoadMore = this.onLoadMore;
    const onOpenModal = this.onOpenModal;
    const onToggleModal = this.onToggleModal;

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
      </Layout>
    );
  }
}
