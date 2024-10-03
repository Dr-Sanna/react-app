// DataContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  fetchMatieres,
  fetchSousMatieres,
  fetchCoursData,
  fetchLiensUtiles,
  fetchCasRandomisations, // Import de la nouvelle fonction
} from './api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [matieres, setMatieres] = useState([]);
  const [sousMatieres, setSousMatieres] = useState([]);
  const [casCliniques, setCasCliniques] = useState([]);
  const [casRandomisations, setCasRandomisations] = useState([]); // Nouvel état
  const [totalCases, setTotalCases] = useState(0); // Nouvel état
  const [cours, setCours] = useState([]);
  const [parts, setParts] = useState([]);
  const [liensUtiles, setLiensUtiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoursLoading, setIsCoursLoading] = useState(false);

  const preloadImages = (items) => {
    items.forEach(item => {
      const imageUrl = item.attributes.image?.data?.attributes?.url;
      if (imageUrl) {
        const img = new Image();
        img.src = imageUrl;
      }
    });
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [matieresData, sousMatieresData, liensUtilesData, casRandomisationsData] = await Promise.all([
        fetchMatieres(),
        fetchSousMatieres(),
        fetchLiensUtiles(),
        fetchCasRandomisations(), // Appel à la nouvelle fonction
      ]);

      setMatieres(matieresData);
      setSousMatieres(sousMatieresData);
      setLiensUtiles(liensUtilesData);
      setCasRandomisations(casRandomisationsData); // Mise à jour de l'état
      setTotalCases(casRandomisationsData.length); // Mise à jour de l'état

      // Précharger les images des matières, sous-matières et cas randomisés
      preloadImages(matieresData);
      preloadImages(sousMatieresData);
      preloadImages(casRandomisationsData); // Préchargement des images des cas randomisés

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
      setCours(coursData);

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
      matieres,
      sousMatieres,
      casCliniques,
      casRandomisations, // Exposer les cas randomisés
      totalCases, // Exposer le nombre total de cas
      cours,
      parts,
      liensUtiles,
      isLoading,
      isCoursLoading,
      setCasCliniques,
      setCours,
      setParts,
      setIsLoading,
      setIsCoursLoading,
      fetchCours,
    }}>
      {children}
    </DataContext.Provider>
  );
};
