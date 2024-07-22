import React, { useState } from 'react';

const VideoToggle = ({ videoSrc }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(prevState => !prevState);
  };

  return (
    <div>
      <button className="video-button" onClick={toggleVisibility}>
        Vidéo explicative
      </button>
      <div className="iframe-container" style={{ display: isVisible ? 'block' : 'none' }}>
        <iframe
          width="560"
          height="315"
          src={videoSrc}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoToggle;
