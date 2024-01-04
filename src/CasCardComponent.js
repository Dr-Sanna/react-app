import React from 'react';
import MaterialCard from './MaterialCard';

const CasCardComponent = React.memo(({ cas, onSelection }) => {
  const baseUrl = process.env.REACT_APP_STRAPI_URL || ''; // Assurez-vous que cette variable est correctement définie.

  // Utilisez l'URL de base de l'image
  const imageUrl = cas?.attributes?.image?.data?.attributes?.url
    ? `${baseUrl}${cas.attributes.image.data.attributes.url}`
    : '/defaultImage.jpg'; // Image par défaut si aucune n'est trouvée.

  return (
    <MaterialCard
      title={cas?.attributes?.titre || 'Titre inconnu'}
      imageUrl={imageUrl}
      onClick={() => onSelection(cas)}
    />
  );
});

export default CasCardComponent;
