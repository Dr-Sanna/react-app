import React, { useState, useEffect } from 'react';
import Accordion from './Accordion';
import CustomMarkdown from './CustomMarkdown';
import QCM from './QCM';
import './QCM.css';

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

  useEffect(() => {
    // Réinitialiser les options et isChecked quand qcms change
    setSelectedOptions({});
    setIsChecked(false);
  }, [qcms]);

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
    setIsChecked((prevChecked) => !prevChecked);
    if (isChecked) {
      setSelectedOptions({});
    }
  };

  return (
    <>
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

      {hasQCMs && (
        <div className="qcm-section">
          <h3>QCM</h3>
          {qcms.map((qcm, qcmIndex) => (
            <QCM
              key={qcmIndex}
              question={qcm.question}
              propositions={qcm.proposition}
              complement={qcm.complement}
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
