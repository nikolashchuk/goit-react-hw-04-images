import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { Backdrop, ModalWindow } from './Modal.styled';

export default class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleEsc);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleEsc);
  }

  handleBackdrop = event => {
    if (event.target === event.currentTarget) {
      this.props.onClose();
    }
  };

  handleEsc = event => {
    if (event.code === 'Escape') {
      this.props.onClose();
    }
  };

  render() {
    const { currentImageUrl, currentImageDescription } = this.props;

    return createPortal(
      <Backdrop onClick={this.handleBackdrop}>
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
}
