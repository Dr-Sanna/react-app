import React from 'react';
import MaterialCard from './MaterialCard';
import { server } from './config';

const CasCardComponent = React.memo(({ cas, onSelection }) => {
  // Utilisez l'URL de base de l'image
  const imageUrl = cas?.attributes?.image?.data?.attributes?.url
    ? `${server}${cas.attributes.image.data.attributes.url}`
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