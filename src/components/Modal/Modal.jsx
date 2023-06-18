import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Backdrop, ModalWindow } from './Modal.styled';

export default function Modal({
  currentImageUrl,
  currentImageDescription,
  onClose,
}) {
  useEffect(() => {
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleBackdrop = event => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleEsc = event => {
    if (event.code === 'Escape') {
      onClose();
    }
  };

  return createPortal(
    <Backdrop onClick={handleBackdrop}>
      <ModalWindow>
        <img
          src={currentImageUrl}
          alt={currentImageDescription}
          loading="lazy"
        />
      </ModalWindow>
    </Backdrop>,
    document.querySelector('#modal-root')
  );
}
