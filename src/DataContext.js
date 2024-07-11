import React, { createContext, useState, useEffect, useCallback } from 'react';
import { fetchMatieres, fetchSousMatieres, fetchCasCliniques, fetchCoursData } from './api';
import { preloadImage, preloadImages } from './utils';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [matieres, setMatieres] = useState([]);
  const [sousMatieres, setSousMatieres] = useState([]);
  const [casCliniques, setCasCliniques] = useState([]);
  const [cours, setCours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoursLoading, setIsCoursLoading] = useState(false);

  const preloadNestedTestImages = async (test) => {
    if (test) {
      const testImageUrl = test.image ? test.image.data.attributes.url : '';
      if (testImageUrl) {
        await preloadImage(testImageUrl);
      }

      // Preload images in the nested test of test components
      if (Array.isArray(test.test)) {
        await Promise.all(test.test.map(async (nestedTestItem) => {
          const deeperNestedImageUrl = nestedTestItem.image ? nestedTestItem.image.data.attributes.url : '';
          if (deeperNestedImageUrl) {
            await preloadImage(deeperNestedImageUrl);
          }

          // Recursively preload images in further nested tests
          if (nestedTestItem.test) {
            await preloadNestedTestImages(nestedTestItem);
          }
        }));
      }
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const [matieresData, sousMatieresData, casCliniquesData] = await Promise.all([
        fetchMatieres(),
        fetchSousMatieres(),
        fetchCasCliniques()
      ]);

      setMatieres(matieresData);
      setSousMatieres(sousMatieresData);

      console.log('Cas Cliniques Data:', casCliniquesData);

      // Précharger les images des cas cliniques
      await Promise.all(casCliniquesData.map(async (item) => {
        // Preload images in the nested test components
        if (item.attributes.test) {
          await preloadNestedTestImages(item.attributes.test);
        }
      }));

      setCasCliniques(casCliniquesData);

    } catch (error) {
      console.error("Erreur de récupération des données:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCours = useCallback(async (pathname) => {
    setIsCoursLoading(true);
    try {
      const coursData = await fetchCoursData(pathname);

      // Précharger les images des cours
      await Promise.all(coursData.map(async (item) => {
        if (item.attributes.test) {
          await preloadNestedTestImages(item.attributes.test);
        }
      }));

      setCours(coursData);
    } catch (error) {
      console.error("Erreur de récupération des données des cours:", error);
    } finally {
      setIsCoursLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DataContext.Provider value={{
      matieres, sousMatieres, casCliniques, cours, isLoading, isCoursLoading, setCours, setIsLoading, setIsCoursLoading, fetchCours
    }}>
      {children}
    </DataContext.Provider>
  );
};
