import React, { useState, useEffect, useRef } from 'react';
import './Modal.css';

const ImageModal = React.memo(({ src, alt, modalAlt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Nouvel état pour suivre le chargement de l'image
  const imgRef = useRef(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsLoading(true); // Réinitialiser l'état de chargement lors de l'ouverture de la modal
    document.body.style.overflow = 'hidden'; // Désactiver le défilement
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Réactiver le défilement
  };

  useEffect(() => {
    console.log('Rendering ImageModal');
    // Fonction de nettoyage pour réactiver le défilement lors de la destruction du composant
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (imgRef.current.complete) {
      imgRef.current.style.opacity = 1;
      setIsLoading(false); // L'image est chargée, on cache l'indicateur de chargement
    }
  }, [isModalOpen]);

  const handleImageLoad = () => {
    setIsLoading(false); // L'image est chargée, on cache l'indicateur de chargement
    imgRef.current.style.opacity = 1; // Affiche l'image
  };

  return (
    <div>
      <div className="modal-image-container">
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onClick={handleOpenModal}
          onLoad={handleImageLoad} // Déclenché lorsque l'image est complètement chargée
          style={{
            width: 'auto',
            maxHeight: '60vh',
            display: 'block',
            cursor: 'pointer',
            objectFit: 'contain', // Assure que l'image n'est pas tronquée
            opacity: 0, // Assure que l'image est invisible avant le chargement
            transition: 'opacity 0.5s ease-in-out', // Ajout d'une transition douce pour l'apparition de l'image
          }}
        />
        {isLoading && (
          <div className="loading-indicator"></div> // Indicateur de chargement
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {isLoading && (
              <div className="loading-indicator">Loading...</div> // Indicateur de chargement dans la modal
            )}
            <img
              src={src}
              alt={modalAlt || alt}
              onLoad={handleImageLoad} // Déclenché lorsque l'image est complètement chargée
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                display: isLoading ? 'none' : 'block', // Cacher l'image tant qu'elle n'est pas chargée
                objectFit: 'contain', // Assure que l'image n'est pas tronquée
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

export default ImageModal;
