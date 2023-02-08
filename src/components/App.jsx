import { useState, useEffect } from 'react';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { Searchbar } from './Searchbar/Searchbar';
import { Container } from './App.styled';
import toast, { Toaster } from 'react-hot-toast';
import { fetchData } from 'services/api';

const KEY = '32020214-fecd0cdd64e7a8e2885aa4914';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  LOADING: 'loading',
};

export function App() {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(Status.IDLE);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [largeImgUrl, setLargeImgUrl] = useState(null);

  useEffect(() => {
    async function fetchImages(name, page) {
      setStatus(Status.PENDING);

      const URL = `https://pixabay.com/api/?q=${name}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=15`;

      try {
        const imgArray = await fetchData(URL);

        if (imgArray.length === 0) {
          throw new Error('No images with this name');
        }

        setImages(prevState => [...prevState, ...imgArray]);
        setStatus(Status.RESOLVED);
        toast.success('Images found.');
      } catch (error) {
        setStatus(Status.REJECTED);
        toast.error('No images with this title.');
      }
    }

    if (searchValue !== '') {
      fetchImages(searchValue, page);
    }
  }, [searchValue, page]);

  const saveSearchValue = value => {
    if (value === '') {
      toast.error('Please enter a search query.');
    }

    setSearchValue(value);
    setPage(1);
    setImages([]);
  };

  const clickLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  return (
    <Container>
      <Searchbar onSubmit={saveSearchValue} />

      <div>
        {status === 'pending' && <Loader />}

        {images.length > 0 && (
          <ImageGallery images={images} openModal={setLargeImgUrl} />
        )}
      </div>

      {status === 'loading' && <Loader />}

      {images.length > 0 && <Button onClickButton={clickLoadMore} />}

      {largeImgUrl && (
        <Modal image={largeImgUrl} onCloseModal={setLargeImgUrl} />
      )}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{ duration: 5000 }}
      />
    </Container>
  );
}
