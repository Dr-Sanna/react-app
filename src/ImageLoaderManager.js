import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from './config';
import { CustomToothLoader } from './CustomToothLoader';
import { toUrlFriendly } from './config';

const ImageLoaderManager = ({ queryURL, children }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoadedStates, setImageLoadedStates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data from URL:', queryURL);
      setIsLoading(true);
      try {
        const response = await axios.get(queryURL);
        const data = response.data.data || [];
        console.log('Data fetched:', data);

        const preloadedData = data.map(item => {
          const imageUrl = item.attributes.image?.data?.attributes?.url
            ? `${server}${item.attributes.image.data.attributes.url}`
            : null;
          return {
            ...item,
            preloaded: true,
            urlFriendlyTitre: toUrlFriendly(item.attributes.titre),
            images: imageUrl ? [{
              url: imageUrl,
              caption: item.attributes.image.data.attributes.caption
            }] : []
          };
        });

        setData(preloadedData);
        setImageLoadedStates(new Array(preloadedData.length).fill(false));
        console.log('Preloaded data:', preloadedData);
      } catch (error) {
        console.error("Erreur de récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [queryURL]);

  useEffect(() => {
    console.log('Image loaded states:', imageLoadedStates);
  }, [imageLoadedStates]);

  const handleImageLoad = (index) => {
    setImageLoadedStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = true;
      return newStates;
    });
  };

  const allImagesLoaded = imageLoadedStates.length === data.length && imageLoadedStates.every(state => state);

  return (
    <>
      {isLoading || !allImagesLoaded ? (
        <CustomToothLoader />
      ) : (
        children(data, handleImageLoad)
      )}
    </>
  );
};

export default ImageLoaderManager;
