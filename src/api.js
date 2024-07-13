import axios from 'axios';
import { toUrlFriendly } from './config';

const API_URL = process.env.REACT_APP_STRAPI_URL;
const cache = {};

const fetchWithCache = async (url) => {
  if (cache[url]) {
    return cache[url];
  }
  const response = await axios.get(url);
  cache[url] = response.data.data;
  return cache[url];
};

export const fetchMatieres = async () => {
  return fetchWithCache(`${API_URL}/api/matieres?populate=*`);
};

export const fetchSousMatieres = async () => {
  return fetchWithCache(`${API_URL}/api/sous-matieres?populate=*`);
};

export const fetchCasCliniques = async () => {
  try {
    return fetchWithCache(`${API_URL}/api/cas-cliniques?populate[test][populate]=image,test,test.image`);
  } catch (error) {
    console.error('Erreur lors de la récupération des cas cliniques:', error);
    throw error;
  }
};

export const fetchCoursData = async (pathname) => {
  if (!pathname) throw new Error("Pathname is undefined");

  const sousMatieres = await fetchSousMatieres();
  console.log("Fetched sousMatieres:", sousMatieres);

  const sousMatiere = sousMatieres.find(sousMatiere => pathname.includes(toUrlFriendly(sousMatiere.attributes.titre)));
  if (!sousMatiere) throw new Error(`No sous-matiere found for path: ${pathname}`);
  
  const sousMatiereId = sousMatiere.id;

  let url = '';
  if (pathname.includes('odontologie-pediatrique')) {
    url = `${API_URL}/api/odontologie-pediatriques?populate=*`;
    if (pathname.includes('therapeutiques-pulpaires-des-dt')) {
      url += `&filters[test][sous_matiere][id][$eq]=${sousMatiereId}`;
    }
  } else if (pathname.includes('risques-medicaux')) {
    url = `${API_URL}/api/risques-medicauxes?populate[test][populate]=sous_matiere,image,test,test.image`;
    if (pathname.includes('bilans-sanguins')) {
      url += `&filters[test][sous_matiere][id][$eq]=${sousMatiereId}`;
    } else if (pathname.includes('risque-infectieux')) {
      url += `&filters[test][sous_matiere][id][$eq]=${sousMatiereId}`;
    } else if (pathname.includes('risque-hemorragique')) {
      url += `&filters[test][sous_matiere][id][$eq]=${sousMatiereId}`;
    }
  } else if (pathname.includes('occlusion-et-fonction')) {
    url = `${API_URL}/api/occlusion-et-fonctions?populate[test][populate]=sous_matiere,image,test,test.image`;
    if (pathname.includes('occlusion-et-manducation')) {
      url += `&filters[test][sous_matiere][id][$eq]=${sousMatiereId}`;
    }
  } else if (pathname.includes('moco') && pathname.includes('medecine-orale')) {
    url = `${API_URL}/api/medecine-orales?populate=*&filters[sous_matiere][id][$eq]=${sousMatiereId}`;
  }
  if (!url) return [];

  return fetchWithCache(url);
};

export const fetchSousMatiereByPath = async (path) => {
  const sousMatieres = await fetchSousMatieres();
  console.log("Sous-matières récupérées :", sousMatieres);

  const sousMatiere = sousMatieres.find(sousMatiere => path.includes(toUrlFriendly(sousMatiere.attributes.titre)));
  if (!sousMatiere) throw new Error(`No ID found for path: ${path}`);
  
  return fetchWithCache(`${API_URL}/api/sous-matieres/${sousMatiere.id}`);
};

export const fetchPartiesData = async () => {
  return fetchWithCache(`${API_URL}/api/occlusion-et-fonction-parties?populate[test][populate]=sous_matiere,image,test,test.image`);
};
