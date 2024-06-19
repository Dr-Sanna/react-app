import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ModalImage from 'react-modal-image';

const LazyImage = ({ src, alt, imageStyle }) => {
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    if (img.complete) {
      setIsCached(true);
    } else {
      img.onload = () => setIsCached(true);
    }
  }, [src]);

  return isCached ? (
    <div style={{ display: 'flex', justifyContent: 'center', ...imageStyle }}>
      <ModalImage
        small={src}
        large={src}
        alt={alt}
        hideDownload={true}
        hideZoom={false}
      />
    </div>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', ...imageStyle }}>
      <LazyLoadImage
        src={src}
        alt={alt}
        effect="blur"
        style={imageStyle}
        placeholderSrc={src} // Optional: Use a low-res version of the image as a placeholder
        wrapperClassName="lazy-load-image-wrapper"
        className="lazy-load-image"
      />
    </div>
  );
};

export default LazyImage;
