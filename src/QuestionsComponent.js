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
    setIsChecked(true);
  };

  return (
    <>
      {hasQuestions && <h3>Questions</h3>}
      {hasQuestions ? (
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
      ) : (
        !hasQCMs && <p>Pas de questions disponibles.</p>
      )}
      {hasQCMs && (
        <>
          <h3>QCM</h3>
          {qcms.map((qcm, qcmIndex) => (
            <QCM
              key={qcmIndex}
              question={qcm.question}
              propositions={qcm.proposition}
              selectedOptions={selectedOptions[qcmIndex] || {}}
              handleCheckboxChange={(optionIndex) => handleCheckboxChange(qcmIndex, optionIndex)}
              isChecked={isChecked}
            />
          ))}
          <button className="check-all-button" onClick={handleCheckAnswers}>Tout vérifier</button>
        </>
      )}
    </>
  );
};

export default QuestionsComponent;
