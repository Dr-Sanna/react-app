import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataContext } from './DataContext';
import DisplayItems from './DisplayItems';
import { toUrlFriendly } from './config';

const Matiere = () => {
  const { matieres, sousMatieres, setSelectedSousMatiere } = useContext(DataContext);
  const [filteredSousMatieres, setFilteredSousMatieres] = useState([]);
  const navigate = useNavigate();
  const { matiereTitle } = useParams();

  useEffect(() => {
    if (matieres.length > 0 && sousMatieres.length > 0) {
      const matiere = matieres.find(m => toUrlFriendly(m.attributes.titre) === matiereTitle);
      if (matiere) {
        const relatedSousMatieres = sousMatieres.filter(sm => sm.attributes.matiere.data.id === matiere.id);
        setFilteredSousMatieres(relatedSousMatieres);
      }
    }
  }, [matiereTitle, matieres, sousMatieres]);

  const handleSousMatiereClick = (sousMatiere) => {
    const titleUrl = toUrlFriendly(sousMatiere.attributes.titre);
    const sousMatiereId = sousMatiere.id;

    setSelectedSousMatiere(sousMatiere);  // Déclencher la sélection de la sous-matière

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

  return <DisplayItems items={filteredSousMatieres} onClickItem={handleSousMatiereClick} />;
};

export default Matiere;
