import React, { useState } from 'react';
import Accordion from './Accordion';
import CustomMarkdown from './CustomMarkdown';
import QCM from './QCM'; // Assurez-vous que le chemin est correct
import './QCM.css'; // Importez le fichier CSS

const QuestionsComponent = ({ courseQuestions, partQuestions, qcms, title, isPart }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isChecked, setIsChecked] = useState(false);

  const imgStyle = {
    maxHeight: '60vh',
    width: 'auto',
    marginBottom: 'var(--ifm-leading)',
  };

  const questions = isPart ? partQuestions : courseQuestions;
  const hasQuestions = Array.isArray(questions) && questions.length > 0;
  const hasQCMs = Array.isArray(qcms) && qcms.length > 0;

  const handleCheckboxChange = (qcmIndex, optionIndex) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [qcmIndex]: {
        ...prev[qcmIndex],
        [optionIndex]: !prev[qcmIndex]?.[optionIndex],
      },
    }));
  };

  const handleCheckAnswers = () => {
    if (isChecked) {
      // Réinitialiser les options et désactiver le mode "vérification"
      setSelectedOptions({});
      setIsChecked(false);
    } else {
      // Activer la vérification
      setIsChecked(true);
    }
  };

  return (
    <>
      {/* Affichage des questions si présentes */}
      {hasQuestions && <h3>Questions</h3>}
      {hasQuestions && (
        <>
          {questions.map((item, index) => (
            <Accordion
              key={index}
              title={<p><strong>{item.question}</strong></p>}
              content={
                <CustomMarkdown
                  markdownText={item.correction || 'Pas de correction disponible.'}
                  imageStyle={imgStyle}
                />
              }
            />
          ))}
        </>
      )}

      {/* N'afficher la section qcm-section que si des QCM sont présents */}
      {hasQCMs && (
        <div className="qcm-section"> {/* Ajout de l'espace et de la séparation */}
          <h3>QCM</h3>
          {qcms.map((qcm, qcmIndex) => (
            <QCM
              key={qcmIndex}
              question={qcm.question}
              propositions={qcm.proposition}
              complement={qcm.complement}  // Transmission du complément au composant QCM
              selectedOptions={selectedOptions[qcmIndex] || {}}
              handleCheckboxChange={(optionIndex) => handleCheckboxChange(qcmIndex, optionIndex)}
              isChecked={isChecked}
            />
          ))}
          <button className="check-all-button" onClick={handleCheckAnswers}>
            {isChecked ? 'Recommencer' : 'Tout vérifier'}
          </button>
        </div>
      )}
    </>
  );
};

export default QuestionsComponent;
