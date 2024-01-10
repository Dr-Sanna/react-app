import React from 'react';
import { Link } from 'react-router-dom';

const GenericBreadcrumbs = ({ breadcrumbs }) => {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className="theme-doc-breadcrumbs breadcrumbsContainer_Wvrh">
      <ul className="breadcrumbs" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbs.map((crumb, index) => (
          <li 
            key={index} 
            className={`breadcrumbs__item ${crumb.active ? 'breadcrumbs__item--active' : ''}`} 
            itemScope 
            itemType="https://schema.org/ListItem">
            {crumb.link ? (
              <Link to={crumb.link} className="breadcrumbs__link" aria-label={crumb.isHome ? "Page d’accueil" : crumb.title} itemProp="item">
                {crumb.isHome ? (
                  <svg viewBox="0 0 24 24" className="breadcrumbHomeIcon_uaSn">
                    <path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" fill="currentColor"></path>
                  </svg>
                ) : (
                  <span itemProp="name">{crumb.title}</span>
                )}
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
};

const BreadcrumbsComponent = ({ selectedCas, currentPath }) => {
  // Logique pour déterminer les éléments du fil d'Ariane
  const breadcrumbs = [
    { title: 'Home', link: '/', active: currentPath === '/', isHome: true },
    { title: 'Moco', link: '/moco', active: currentPath === '/moco' },
    // Ajoutez d'autres éléments ici en fonction de votre logique et de votre structure URL
  ];

  // Conditionnellement, ajoutez "Cas clinique" et le cas sélectionné si nécessaire
  if (currentPath.startsWith('/moco/cas-cliniques-du-cneco')) {
    breadcrumbs.push({ title: 'Cas clinique du CNECO', link: '/moco/cas-cliniques-du-cneco', active: currentPath === '/moco/cas-cliniques-du-cneco' && !selectedCas });
    if (selectedCas) {
      breadcrumbs.push({ title: selectedCas.attributes.titre, active: true }); // Pas de lien ici car c'est l'élément actif
    }
  }

  // Utilisation du composant générique pour rendre les éléments du fil d'Ariane
  return <GenericBreadcrumbs breadcrumbs={breadcrumbs} />;
};

export default BreadcrumbsComponent;