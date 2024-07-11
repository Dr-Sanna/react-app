import React, { useState, useEffect, useRef } from 'react';
import './Modal.css';

const ImageModal = React.memo(({ src, alt, modalAlt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imgRef = useRef(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Disable scrolling
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Enable scrolling
  };

  useEffect(() => {
    console.log('Rendering ImageModal');
    // Clean up function to enable scrolling when component is unmounted
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (imgRef.current.complete) {
      imgRef.current.style.opacity = 1;
    }
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
            width: '100%',
            maxHeight: '60vh',
            display: 'block',
            cursor: 'pointer',
            objectFit: 'contain', // Assure que l'image n'est pas tronquée
            opacity: 1, // Assure que l'image est visible
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
                display: 'block',
                objectFit: 'contain', // Assure que l'image n'est pas tronquée
              }}
            />
            <button className="modal-close-button" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default ImageModal;
