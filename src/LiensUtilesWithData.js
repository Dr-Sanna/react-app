// LiensUtilesWithData.js
import React, { useContext } from 'react';
import { DataContext } from './DataContext';
import LiensUtilesComponent from './LiensUtilesComponent';
import { CustomToothLoader } from './CustomToothLoader';

const LiensUtilesWithData = () => {
  const { liensUtiles, isLoading } = useContext(DataContext);

  if (isLoading) {
    return <CustomToothLoader />;
  }

  if (!liensUtiles || liensUtiles.length === 0) {
    return <div>Aucun lien utile disponible pour le moment.</div>;
  }

  return <LiensUtilesComponent liens={liensUtiles} />;
};

export default LiensUtilesWithData;
