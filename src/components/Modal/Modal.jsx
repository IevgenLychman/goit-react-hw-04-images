import { createPortal } from 'react-dom';
import { ModalStyled, Overlay } from './Modal.styled';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const modalRoot = document.querySelector('#modal-root');

export function Modal({ onCloseModal, image }) {
  useEffect(() => {
    window.addEventListener('keydown', closeByKeyDown);

    return () => {
      window.removeEventListener('keydown', closeByKeyDown);
    };
  });

  const closeByKeyDown = e => {
    if (e.code === 'Escape') {
      onCloseModal(null);
    }
  };

  const closeByClickOnBackdrop = e => {
    if (e.target === e.currentTarget) {
      onCloseModal(null);
    }
  };

  return createPortal(
    <Overlay onClick={closeByClickOnBackdrop}>
      <ModalStyled>
        <img src={image} alt="" />
      </ModalStyled>
    </Overlay>,
    modalRoot
  );
}

Modal.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
};
