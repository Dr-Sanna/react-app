import React, { useState, useEffect, useRef } from 'react';
import './Modal.css';

const ImageModalWithoutTransition = React.memo(({ src, alt, modalAlt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imgRef = useRef(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Désactiver le défilement
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Réactiver le défilement
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div>
      <div className="modal-image-container">
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onClick={handleOpenModal}
          style={{
            width: 'auto',
            maxHeight: '60vh',
            display: 'block',
            cursor: 'pointer',
            objectFit: 'contain',
          }}
        />
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={src}
              alt={modalAlt || alt}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
            <button className="modal-close-button" onClick={handleCloseModal}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default ImageModalWithoutTransition;
