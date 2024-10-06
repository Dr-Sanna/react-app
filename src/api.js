import axios from 'axios';
import { toUrlFriendly } from './config';

const API_URL = process.env.REACT_APP_STRAPI_URL;
const cache = {};

// Liste de configurations pour les chemins et leurs URLs
const config = [
  {
    pathname: 'odontologie-pediatrique',
    plural: 'odontologie-pediatriques',
    parts: 'odontologie_pediatrique_parties'
  },
  {
    pathname: 'risques-medicaux',
    plural: 'risques-medicauxes',
    parts: 'risques_medicaux_parties'
  },
  {
    pathname: 'occlusion-et-fonction',
    plural: 'occlusion-et-fonctions',
    parts: 'occlusion_et_fonction_parties'
  },
  {
    pathname: 'essai-matiere',
    plural: 'essais',
    parts: 'essai_parties'
  },
  {
    pathname: 'anatomie-tete-et-cou',
    plural: 'anatomie-tete-et-cous',
    parts: 'anatomie_tete_et_cou_parties'
  },
  {
    pathname: 'physiologie-clinique-orofaciale',
    plural: 'physiologies',
    parts: 'physiologie_clinique_orofaciale_parties'
  },
  {
    pathname: 'notions-elementaires',
    plural: 'notions-elementaires',
    parts: 'notions_elementaires_parties'
  },
  {
    pathname: 'medecine-orale',
    plural: 'medecine-orales',
    parts: 'medecine_orale_parties'
  }
];

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

export const fetchLiensUtiles = async () => {
  try {
    const data = await fetchWithCache(`${API_URL}/api/liens-utiles`);
    // Transformation des données si nécessaire
    const liensData = data.map(item => ({
      ...item.attributes,
      id: item.id,
    }));
    return liensData;
  } catch (error) {
    console.error('Erreur lors de la récupération des liens utiles:', error);
    throw error;
  }
};

// Correction ici pour accepter l'ID de la sous-matière
export const fetchCasCliniques = async (sousMatiereId) => {
  if (!sousMatiereId) {
    throw new Error("sousMatiereId est nécessaire pour filtrer les cas cliniques.");
  }
  try {
    return fetchWithCache(`${API_URL}/api/cas-cliniques?populate[test][populate]=image,test,test.image&populate[QCM][populate]=proposition&filters[test][sous_matiere][id][$eq]=${sousMatiereId}`);
  } catch (error) {
    console.error('Erreur lors de la récupération des cas cliniques:', error);
    throw error;
  }
};


// Fonction générique pour construire l'URL
const buildGenericUrl = (plural, partsSuffix, sousMatiereId) => {
  const url = `${API_URL}/api/${plural}?populate[test][populate]=sous_matiere,image,test,test.image` +
              `&populate[${partsSuffix}][populate][test][populate]=*` +
              `&populate[QCM][populate]=proposition` +
              `&filters[test][sous_matiere][id][$eq]=${sousMatiereId}`;
  return url;
};

export const fetchCoursData = async (pathname) => {
  if (!pathname) throw new Error("Pathname is undefined");

  const sousMatieres = await fetchSousMatieres();
  const sousMatiere = sousMatieres.find(sousMatiere => pathname.includes(toUrlFriendly(sousMatiere.attributes.titre)));
  if (!sousMatiere) throw new Error(`No sous-matiere found for path: ${pathname}`);

  const sousMatiereId = sousMatiere.id;

  // Trouver la configuration correspondante
  const configItem = config.find(item => pathname.includes(item.pathname));
  
  if (!configItem) throw new Error(`No configuration found for pathname: ${pathname}`);

  const { plural, parts } = configItem;

  // Construire l'URL
  const url = buildGenericUrl(plural, parts, sousMatiereId);

  return fetchWithCache(url);
};

export const fetchSousMatiereByPath = async (path) => {
  const sousMatieres = await fetchSousMatieres();
  const sousMatiere = sousMatieres.find(sousMatiere => path.includes(toUrlFriendly(sousMatiere.attributes.titre)));
  if (!sousMatiere) throw new Error(`No ID found for path: ${path}`);

  return fetchWithCache(`${API_URL}/api/sous-matieres/${sousMatiere.id}`);
};

// Ajout de la fonction fetchCasRandomisations
export const fetchCasRandomisations = async () => {
  try {
    return fetchWithCache(
      `${API_URL}/api/cas-randomisations?populate[pathologie][populate]=*&populate[image]=*`
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des cas randomisés:', error);
    throw error;
  }
};