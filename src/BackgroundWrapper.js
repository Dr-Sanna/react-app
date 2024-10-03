// BackgroundWrapper.js
import React from 'react';
import './BackgroundWrapper.css';

// Importation de l'image d'arrière-plan
import backgroundImage from './assets/background_image.png';

const BackgroundWrapper = ({ children }) => {
  return (
    <div
      className="background-wrapper"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {children}
    </div>
  );
};

export default BackgroundWrapper;
