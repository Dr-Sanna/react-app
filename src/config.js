// Détermination de l'environnement de développement ou de production
const dev = process.env.NODE_ENV !== 'production';

// Configuration de l'URL du serveur en fonction de l'environnement
export const server = dev ? process.env.REACT_APP_STRAPI_URL : '';

// Fonction pour transformer un titre en format URL amical
export const toUrlFriendly = (title) => {
    if (!title) {
      return '';
    }
  
    return title
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Normalise et enlève les accents
      .toLowerCase()
      .replace(/\s+/g, '-') // Remplace les espaces par des tirets
      .replace(/[']+/g, '-') // Remplace les apostrophes et les '/' par des tirets
      .replace(/[^a-z0-9-]/g, ''); // Enlève tout ce qui n'est pas alphanumérique ou un tiret
  };
  


// Vous pouvez ajouter ici d'autres configurations ou fonctions utilitaires
// Par exemple, si vous avez des paramètres API récurrents ou des configurations de thèmes


