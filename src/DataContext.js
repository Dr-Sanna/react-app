import React, { createContext, useState, useEffect, useCallback } from 'react';
import { fetchMatieres, fetchSousMatieres, fetchCasCliniques, fetchCoursData } from './api';
import { preloadImage } from './utils';
import { server } from './config';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [matieres, setMatieres] = useState([]);
  const [sousMatieres, setSousMatieres] = useState([]);
  const [casCliniques, setCasCliniques] = useState([]);
  const [cours, setCours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoursLoading, setIsCoursLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [matieresData, sousMatieresData, casCliniquesData] = await Promise.all([
        fetchMatieres(),
        fetchSousMatieres(),
        fetchCasCliniques()
      ]);

      setMatieres(matieresData);
      setSousMatieres(sousMatieresData);

      // Précharger les images des cas cliniques
      await Promise.all(casCliniquesData.map(async (cas) => {
        const imageUrl = cas.attributes.image ? `${server}${cas.attributes.image.data.attributes.url}` : '';
        await preloadImage(imageUrl);
      }));
      setCasCliniques(casCliniquesData);

    } catch (error) {
      console.error("Erreur de récupération des données:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DataContext.Provider value={{
      matieres, sousMatieres, casCliniques, cours, isLoading, isCoursLoading, setCours, setIsLoading, setIsCoursLoading
    }}>
      {children}
    </DataContext.Provider>
  );
};
