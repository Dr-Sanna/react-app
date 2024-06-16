import React from 'react';
import { Highlight } from 'react-instantsearch-dom';
import { useNavigate } from 'react-router-dom';
import { toUrlFriendly } from './config'; // Assurez-vous d'importer cette fonction
import { HitIcon, SelectIcon } from './IconComponents';

// Fonction pour enlever les balises Markdown de base
const removeMarkdown = (text) => {
  return text
    .replace(/[#*~_`>]/g, '') // Enlève les caractères de formatage Markdown de base
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Enlève les liens
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1'); // Enlève les images
};

const GuideCliniqueHit = ({ hit, onClose }) => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    event.preventDefault();
    const titre = hit.titre ? toUrlFriendly(hit.titre) : ''; // Formatez le titre du guide
    const indexMatiere = hit.indexMatiere ? toUrlFriendly(hit.indexMatiere) : ''; // Formatez la matière
    const indexSousMatiere = hit.indexSousMatiere ? toUrlFriendly(hit.indexSousMatiere) : ''; // Formatez la sous-matière
    navigate(`/${indexMatiere}/${indexSousMatiere}/${titre}`);
    onClose(); // Ferme le modal
  };

  return (
    <li className="DocSearch-Hit" role="option" aria-selected="false">
      <a href={`/${toUrlFriendly(hit.indexMatiere)}/${toUrlFriendly(hit.indexSousMatiere)}/${toUrlFriendly(hit.titre)}`} onClick={handleClick}>
        <div className="DocSearch-Hit-Container">
          <div className="DocSearch-Hit-icon">
            <HitIcon />
          </div>
          <div className="DocSearch-Hit-content-wrapper">
            <span className="DocSearch-Hit-title">
              <Highlight attribute="titre" hit={hit} />
            </span>
            <span className="DocSearch-Hit-path">
              {removeMarkdown(hit.enonce)}
            </span>
          </div>
          <div className="DocSearch-Hit-action">
            <SelectIcon />
          </div>
        </div>
      </a>
    </li>
  );
};

export default GuideCliniqueHit;
