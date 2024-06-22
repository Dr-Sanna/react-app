import React, { useState, useEffect, useRef } from 'react';
import './Modal.css';

const ImageModal = React.memo(({ src, alt, placeholder, modalAlt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
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

  return (
    <div>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          style={{
            filter: loaded ? 'blur(0)' : 'blur(20px)',
            transition: 'filter 0.5s ease-out',
            width: '100%',
            maxHeight: '60vh',
            display: 'block',
            cursor: 'pointer',
            objectFit: 'contain', // Assure que l'image n'est pas tronquée
          }}
          onLoad={() => {
            setLoaded(true);
            setHasLoaded(true);
          }}
          onClick={handleOpenModal}
        />
        {!hasLoaded && (
          <img
            src={placeholder}
            alt={alt}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              filter: 'blur(20px)',
            }}
          />
        )}
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
