import React, { createContext, useState, useEffect, useCallback } from 'react';
import { fetchMatieres, fetchSousMatieres, fetchCasCliniques, fetchCoursData } from './api';
import { preloadImage } from './utils';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [matieres, setMatieres] = useState([]);
  const [sousMatieres, setSousMatieres] = useState([]);
  const [casCliniques, setCasCliniques] = useState([]);
  const [cours, setCours] = useState([]);
  const [parts, setParts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoursLoading, setIsCoursLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [matieresData, sousMatieresData, casCliniquesData] = await Promise.all([
        fetchMatieres(),
        fetchSousMatieres(),
        fetchCasCliniques()
      ]);

      // Précharger les images des matières et sous-matières
      await Promise.all([...matieresData, ...sousMatieresData].map(async (item) => {
        const imageUrl = item.attributes.image?.data?.attributes.url;
        if (imageUrl) {
          await preloadImage(imageUrl);
        }
      }));

      setMatieres(matieresData);
      setSousMatieres(sousMatieresData);
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
        const imageUrl = item.attributes.image?.data?.attributes.url;
        if (imageUrl) {
          await preloadImage(imageUrl);
        }
      }));

      setCours(coursData);

      // Extraire et définir les parties
      const partsData = coursData.flatMap(cour => {
        const partsRelationName = Object.keys(cour.attributes).find(key => key.endsWith('_parties'));
        const partsRelation = cour.attributes[partsRelationName]?.data;
        return partsRelation ? partsRelation.map(part => ({ titre: part.attributes.test.titre, enonce: part.attributes.test.enonce })) : [];
      });
      setParts(partsData);

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
      matieres, sousMatieres, casCliniques, cours, parts, isLoading, isCoursLoading, setCours, setParts, setIsLoading, setIsCoursLoading, fetchCours
    }}>
      {children}
    </DataContext.Provider>
  );
};
