import React from 'react';
import './QCM.css'; // Importez le fichier CSS

const QCM = ({ question, propositions, selectedOptions, handleCheckboxChange, isChecked }) => {
  return (
    <div className="qcm">
      <h4>{question}</h4>
      <div className="qcm-propositions">
        <ul>
          {propositions.map((prop, index) => (
            <li
              key={index}
              className={
                isChecked
                  ? selectedOptions[index]
                    ? prop.isCorrect
                      ? 'correct'
                      : 'incorrect'
                    : prop.isCorrect
                    ? 'missed'
                    : ''
                  : ''
              }
            >
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedOptions[index]}
                  onChange={() => handleCheckboxChange(index)}
                  disabled={isChecked}
                />
                {prop.proposition}
              </label>
              {isChecked && !prop.isCorrect && !!selectedOptions[index] && prop.correction && (
                <div className="detail-reponse">
                  <p>Correction : {prop.correction}</p>
                </div>
              )}
              {isChecked && !prop.isCorrect && !selectedOptions[index] && prop.correction && (
                <div className="detail-reponse normal-correction">
                  <p>Correction : {prop.correction}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QCM;
