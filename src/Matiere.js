import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataContext } from './DataContext';
import DisplayItems from './DisplayItems';
import { toUrlFriendly } from './config';

const Matiere = () => {
  const { matieres, sousMatieres, setCours } = useContext(DataContext);
  const [filteredSousMatieres, setFilteredSousMatieres] = useState([]);
  const navigate = useNavigate();
  const { matiereTitle } = useParams();

  useEffect(() => {
    setCours([]); // Réinitialiser les cours au montage du composant

    if (matieres.length > 0 && sousMatieres.length > 0) {
      const matiere = matieres.find(m => toUrlFriendly(m.attributes.titre) === matiereTitle);
      if (matiere) {
        const relatedSousMatieres = sousMatieres.filter(sm => sm.attributes.matiere.data.id === matiere.id);
        setFilteredSousMatieres(relatedSousMatieres);
      }
    }
  }, [matiereTitle, matieres, sousMatieres, setCours]);

  const handleSousMatiereClick = (sousMatiere) => {
    const titleUrl = toUrlFriendly(sousMatiere.attributes.titre);
    const sousMatiereId = sousMatiere.id;

    switch (sousMatiere.attributes.actionType) {
      case 'cas_cliniques':
      case 'cours':
        navigate(`/${matiereTitle}/${titleUrl}`, { state: { sousMatiereId } });
        break;
      case 'liens_utiles':
        navigate(`/ressources-utiles/${titleUrl}`, { state: { lienId: sousMatiere.id } });
        break;
      default:
        console.log("Type d'action non reconnu");
    }
  };

  const sortedSousMatieres = useMemo(() => {
    return [...filteredSousMatieres].sort((a, b) => a.attributes.order - b.attributes.order);
  }, [filteredSousMatieres]);

  return (
    <DisplayItems items={sortedSousMatieres} onClickItem={handleSousMatiereClick} />
  );
};

export default React.memo(Matiere);
