import React, { useMemo, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon } from './IconComponents';
import { DataContext } from './DataContext';
import { toUrlFriendly } from "./config";

// Fonction de mapping pour récupérer les titres originaux
const getOriginalTitle = (segment, matieres = [], sousMatieres = [], cours = [], casCliniques = [], parts = []) => {
  const matiere = matieres.find(m => toUrlFriendly(m.attributes.titre) === segment);
  if (matiere) return matiere.attributes.titre;

  const sousMatiere = sousMatieres.find(sm => toUrlFriendly(sm.attributes.titre) === segment);
  if (sousMatiere) return sousMatiere.attributes.titre;

  const cour = cours.find(c => toUrlFriendly(c.attributes.test.titre) === segment);
  if (cour) return cour.attributes.test.titre;

  const casClinique = casCliniques.find(cc => toUrlFriendly(cc.attributes.test.titre) === segment);
  if (casClinique) return casClinique.attributes.test.titre;

  const part = parts.find(p => toUrlFriendly(p.titre) === segment);
  if (part) return part.titre;

  // Recherche des titres des parties dans les cours
  for (const cour of cours) {
    const partsRelationName = Object.keys(cour.attributes).find(key => key.endsWith('_parties'));
    if (partsRelationName) {
      const partsRelation = cour.attributes[partsRelationName]?.data;
      if (partsRelation) {
        const foundPart = partsRelation.find(p => toUrlFriendly(p.attributes.test.titre) === segment);
        if (foundPart) return foundPart.attributes.test.titre;
      }
    }
  }

  return segment.replace(/-/g, ' '); // Si aucun titre n'est trouvé, retourner le segment avec les tirets remplacés par des espaces
};

// Fonction pour générer les breadcrumbs à partir de l'URL
const generateBreadcrumbsFromUrl = (currentPath, matieres = [], sousMatieres = [], cours = [], casCliniques = [], parts = []) => {
  const pathSegments = currentPath.split('/').filter(Boolean);
  let pathAccum = '';
  const breadcrumbs = pathSegments.map((segment, index) => {
    pathAccum += `/${segment}`;
    const isLast = index === pathSegments.length - 1;

    const title = getOriginalTitle(segment, matieres, sousMatieres, cours, casCliniques, parts);

    return {
      title,
      link: !isLast ? pathAccum : null,
      active: isLast,
      isHome: false,
    };
  });

  return [{ title: 'Home', link: '/', active: false, isHome: true }, ...breadcrumbs];
};

// Composant générique pour afficher les breadcrumbs
const GenericBreadcrumbs = React.memo(({ breadcrumbs }) => (
  <nav aria-label="Fil d'Ariane" className="theme-doc-breadcrumbs breadcrumbsContainer_Wvrh">
    <ul className="breadcrumbs" itemScope itemType="https://schema.org/BreadcrumbList">
      {breadcrumbs.map((crumb, index) => (
        <li key={index} className={`breadcrumbs__item ${crumb.active ? 'breadcrumbs__item--active' : ''}`} itemScope itemType="https://schema.org/ListItem">
          {crumb.link ? (
            <Link to={crumb.link} className="breadcrumbs__link" aria-label={crumb.isHome ? "Page d’accueil" : crumb.title} itemProp="item">
              {crumb.isHome ? <HomeIcon className="breadcrumbHomeIcon_uaSn" /> : <span itemProp="name">{crumb.title}</span>}
            </Link>
          ) : (
            <span className="breadcrumbs__link" itemProp="name">{crumb.title}</span>
          )}
          <meta itemProp="position" content={index + 1} />
        </li>
      ))}
    </ul>
  </nav>
));

// Composant principal des breadcrumbs
const BreadcrumbsComponent = ({ currentPath, selectedCasTitle, selectedPartieTitle }) => {
  const location = useLocation();
  const { sousMatieres = [], matieres = [], cours = [], casCliniques = [], parts = [] } = useContext(DataContext);
  const breadcrumbs = useMemo(() => generateBreadcrumbsFromUrl(currentPath || location.pathname, matieres, sousMatieres, cours, casCliniques, parts), [currentPath, location.pathname, matieres, sousMatieres, cours, casCliniques, parts]);
  return <GenericBreadcrumbs breadcrumbs={breadcrumbs} />;
};

export default BreadcrumbsComponent;
