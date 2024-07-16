import React, { useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from './IconComponents';
import { DataContext } from './DataContext';
import { toUrlFriendly } from "./config";

const generateBreadcrumbs = (currentPath, selectedCasTitle, selectedPartieTitle, sousMatieres, matieres, cours, casCliniques) => {
  const pathSegments = currentPath.split('/').filter(Boolean);
  let pathAccum = '';
  const breadcrumbs = pathSegments.map((segment, index) => {
    pathAccum += `/${segment}`;
    let title;
    const isLast = index === pathSegments.length - 1;

    if (isLast && selectedPartieTitle) {
      title = selectedPartieTitle;
    } else if (isLast && selectedCasTitle) {
      title = selectedCasTitle;
    } else {
      const matiere = matieres.find(m => toUrlFriendly(m.attributes.titre) === segment);
      const sousMatiere = sousMatieres.find(sm => toUrlFriendly(sm.attributes.titre) === segment);
      const cour = cours.find(c => toUrlFriendly(c.attributes.test.titre) === segment);
      const casClinique = casCliniques.find(cc => toUrlFriendly(cc.attributes.test.titre) === segment);

      title = matiere ? matiere.attributes.titre :
              sousMatiere ? sousMatiere.attributes.titre :
              cour ? cour.attributes.test.titre :
              casClinique ? casClinique.attributes.test.titre :
              segment;
    }

    const isHome = pathAccum === '/';
    return {
      title,
      link: !isLast ? pathAccum : null,
      active: isLast,
      isHome,
    };
  });

  return [{ title: 'Home', link: '/', active: false, isHome: true }, ...breadcrumbs];
};

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

const BreadcrumbsCC = ({ currentPath, selectedCasTitle, selectedPartieTitle }) => {
  const { sousMatieres, matieres, cours, casCliniques } = useContext(DataContext);
  const breadcrumbs = useMemo(() => generateBreadcrumbs(currentPath, selectedCasTitle, selectedPartieTitle, sousMatieres, matieres, cours, casCliniques), [currentPath, selectedCasTitle, selectedPartieTitle, sousMatieres, matieres, cours, casCliniques]);
  return <GenericBreadcrumbs breadcrumbs={breadcrumbs} />;
};

export default BreadcrumbsCC;
