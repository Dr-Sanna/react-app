import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ImageCarousel = ({ images }) => {
  if (!images || images.length === 0) {
    return null;
  }

  const carouselContainerStyle = {
    width: '100%',
    height: '75vh',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.05)' // Ajouter un fond semi-transparent au carousel
  };

  const imageStyle = {
    objectFit: 'contain',
    width: '100%',
    height: '100%'
  };

  console.log('Rendering ImageCarousel with images:', images);

  return (
    <div style={carouselContainerStyle}>
      <Carousel showThumbs={false} autoPlay={false} infiniteLoop={true} showArrows={true}>
        {images.map((image, index) => (
          <div key={index} style={carouselContainerStyle}>
            <img src={image.url} alt={image.caption} style={imageStyle} />
            {image.caption && <p className="legend">{image.caption}</p>}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
