import React from 'react';
import './QCM.css';  // Assurez-vous d'importer le CSS du QCM
import CustomMarkdown from './CustomMarkdown';  // Assurez-vous que le chemin est correct

const QCM = ({ question, propositions, complement, selectedOptions, handleCheckboxChange, isChecked }) => {
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
                  disabled={isChecked}  // Désactiver après vérification
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

      {/* Affichage du complément de réponse uniquement après vérification */}
      {isChecked && complement && (
        <div className="complement-display">
          <h5>Complément de réponse :</h5>
          <CustomMarkdown markdownText={complement} /> {/* Utilisation de CustomMarkdown */}
        </div>
      )}
    </div>
  );
};

export default QCM;
