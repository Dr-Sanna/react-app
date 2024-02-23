import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from './IconComponents'; // Assurez-vous que l'importation est correcte

// Carte d'équivalence URL-titre pour les breadcrumbs
const breadcrumbsMap = {
  '/': { title: 'Home', isHome: true },
  '/guide-clinique-d-odontologie': { title: 'Guide clinique d\'odontologie' },
  '/guide-clinique-d-odontologie/bilans-sanguins': { title: 'Bilans sanguins' },
  '/guide-clinique-d-odontologie/foyers-infectieux-buccodentaires': { title: 'Foyers infectieux buccodentaires' },
  '/moco': { title: 'Moco' },
  '/moco/cas-cliniques-du-cneco': { title: 'Cas cliniques du CNECO' },
  // Ajoutez d'autres chemins au besoin
};

// Fonction pour générer les breadcrumbs basée sur le chemin actuel et le titre du cas sélectionné
const generateBreadcrumbs = (currentPath, selectedCasTitle) => {
  const pathSegments = currentPath.split('/').filter(Boolean);
  let pathAccum = '';
  const breadcrumbs = pathSegments.map((segment, index) => {
    pathAccum += `/${segment}`;
    let title;
    const isLast = index === pathSegments.length - 1;
    if (isLast && selectedCasTitle) {
      // Si un titre de cas est fourni et que nous sommes sur le dernier segment, utilisez ce titre
      title = selectedCasTitle;
    } else {
      // Sinon, utilisez le titre de la carte ou le segment lui-même
      title = breadcrumbsMap[pathAccum]?.title || segment;
    }
    const isHome = breadcrumbsMap[pathAccum]?.isHome || false;

    return {
      title,
      link: !isLast ? pathAccum : null, // Pas de lien pour le dernier élément
      active: isLast,
      isHome,
    };
  });

  // Ajoute le breadcrumb "Home" au début
  return [{ title: 'Home', link: '/', active: false, isHome: true }, ...breadcrumbs];
};

const GenericBreadcrumbs = ({ breadcrumbs }) => (
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
);

const BreadcrumbsComponent = ({ currentPath, selectedCasTitle }) => {
  const breadcrumbs = generateBreadcrumbs(currentPath, selectedCasTitle);
  return <GenericBreadcrumbs breadcrumbs={breadcrumbs} />;
};

export default BreadcrumbsComponent;
