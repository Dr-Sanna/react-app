import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainSections.css';

// Importation directe des images
import medicalCaseImage from './assets/medical_case.png';
import diceImage from './assets/dice.png';
import openBookImage from './assets/open_book.png';
import linksImage from './assets/links.png';

const MainSections = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Cas Cliniques',
      path: '/cas-cliniques',
      description: 'Explorez des cas cliniques détaillés pour enrichir votre expérience pratique.',
      image: medicalCaseImage, 
    },
    {
      title: 'Randomisation',
      path: '/randomisation',
      description: 'Générez des cas aléatoires pour tester vos connaissances et compétences.',
      image: diceImage,
    },
    {
      title: 'Documentation',
      path: '/documentation',
      description: 'Accédez à une vaste documentation couvrant divers sujets en dentisterie.',
      image: openBookImage,
    },
    {
      title: 'Liens Utiles',
      path: '/liens-utiles',
      description: 'Trouvez des ressources en ligne utiles à la pratique quotidienne.',
      image: linksImage,
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
          <img 
            src={section.image} 
            alt={section.title} 
            className="section-icon" 
            onLoad={(e) => e.target.style.opacity = 1} 
          />
          <h2>{section.title}</h2>
          <p className="section-description">{section.description}</p>
        </div>
      ))}
    </div>
  );
};

export default MainSections;
