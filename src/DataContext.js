import React, { createContext, useState, useEffect } from 'react';
import { fetchMatieres, fetchSousMatieres, fetchCasCliniques, fetchCoursData } from './api';
import { preloadImage, preloadImages } from './utils'; // Assurez-vous que preloadImages est également importé
import { server } from './config';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [matieres, setMatieres] = useState([]);
  const [sousMatieres, setSousMatieres] = useState([]);
  const [casCliniques, setCasCliniques] = useState([]);
  const [cours, setCours] = useState([]);
  const [selectedSousMatiere, setSelectedSousMatiere] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoursLoading, setIsCoursLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCours = async () => {
      if (selectedSousMatiere) {
        setIsCoursLoading(true);
        try {
          const coursData = await fetchCoursData(selectedSousMatiere.path);
          const imageUrls = coursData.flatMap(cour =>
            cour.attributes.images ? cour.attributes.images.map(img => `${server}${img.url}`) : []
          );
          await preloadImages(imageUrls);
          setCours(coursData);
        } catch (error) {
          console.error("Erreur de récupération des cours:", error);
        } finally {
          setIsCoursLoading(false);
        }
      } else {
        setCours([]);
      }
    };

    fetchCours();
  }, [selectedSousMatiere]);

  return (
    <DataContext.Provider value={{
      matieres, sousMatieres, casCliniques, cours, isLoading, isCoursLoading, setSelectedSousMatiere, setIsLoading
    }}>
      {children}
    </DataContext.Provider>
  );
};
