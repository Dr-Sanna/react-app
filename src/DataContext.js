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
      const [matieresData, sousMatieresData] = await Promise.all([
        fetchMatieres(),
        fetchSousMatieres(),
      ]);

      setMatieres(matieresData);
      setSousMatieres(sousMatieresData);

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
      matieres, sousMatieres, casCliniques, cours, parts, isLoading, isCoursLoading, setCasCliniques, setCours, setParts, setIsLoading, setIsCoursLoading, fetchCours
    }}>
      {children}
    </DataContext.Provider>
  );
};
