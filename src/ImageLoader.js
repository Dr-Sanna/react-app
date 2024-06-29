import React, { useEffect } from 'react';
import { CardMedia } from '@mui/material';

const ImageLoader = ({ src, onLoad, onError }) => {
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      console.log('Image loaded:', src);
      onLoad();
    };
    img.onerror = () => {
      console.error('Image failed to load:', src);
      onError();
    };
  }, [src, onLoad, onError]);

  return (
    <CardMedia
      component="img"
      image={src}
      alt="Image"
      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
    />
  );
};

export default ImageLoader;
