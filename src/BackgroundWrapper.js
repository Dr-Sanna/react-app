// BackgroundWrapper.js
import React from 'react';
import './BackgroundWrapper.css';

// Importation directe de l'image de fond
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
