// MainSections.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainSections.css';

const MainSections = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Cas Cliniques',
      path: '/cas-cliniques', // Accès direct à MOCO
      description: 'Explorez des cas cliniques détaillés pour enrichir votre expérience pratique.',
      image: '/medical_case.png',
    },
    {
      title: 'Randomisation',
      path: '/randomisation',
      description: 'Générez des cas aléatoires pour tester vos connaissances et compétences.',
      image: '/dice.png',
    },
    {
      title: 'Documentation',
      path: '/documentation', // Point d'entrée pour la liste des matières
      description: 'Accédez à une vaste documentation couvrant divers sujets en dentisterie.',
      image: '/open_book.png',
    },
    {
      title: 'Liens Utiles',
      path: '/liens-utiles',
      description: 'Trouvez des ressources en ligne utiles à la pratique quotidienne.',
      image: '/links.png',
    },
  ];

  const handleSectionClick = (section) => {
    navigate(section.path);
  };

  return (
    <div className="main-sections">
      {sections.map((section) => (
        <div
          key={section.title}
          className="section-card"
          onClick={() => handleSectionClick(section)}
        >
          <img src={section.image} alt={section.title} className="section-icon" />
          <h2>{section.title}</h2>
          <p className="section-description">{section.description}</p>
        </div>
      ))}
    </div>
  );
};

export default MainSections;
