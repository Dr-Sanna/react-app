import React from 'react';
import './QCM.css'; // Assurez-vous d'importer le CSS du QCM
import CustomMarkdown from './CustomMarkdown'; // Assurez-vous que le chemin est correct

const QCM = ({ question, propositions, complement, selectedOptions, handleCheckboxChange, isChecked }) => {
  const totalCorrect = propositions.filter(prop => prop.isCorrect).length;
  const totalSelectedCorrect = propositions.filter((prop, index) => prop.isCorrect && selectedOptions[index]).length;
  const totalSelectedIncorrect = propositions.filter((prop, index) => !prop.isCorrect && selectedOptions[index]).length;

  let feedbackMessage = "";
  let additionalMessage = "";

  if (totalSelectedCorrect === totalCorrect && totalSelectedIncorrect === 0) {
    feedbackMessage = "Bonne réponse !";
  } else if (totalSelectedCorrect > 0 && totalSelectedCorrect < totalCorrect) {
    feedbackMessage = "Partiellement correct";
    additionalMessage = totalSelectedIncorrect > 0
      ? "Il y a des réponses en trop."
      : "Il manque des réponses correctes.";
  } else {
    feedbackMessage = "Mauvaise réponse !";
    additionalMessage = "La bonne réponse était : " + 
      propositions
        .filter(prop => prop.isCorrect)
        .map(prop => prop.proposition)
        .join(', ');
  }

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
                  disabled={isChecked} // Désactiver après vérification
                />
                <span
                  className={isChecked && selectedOptions[index] ? 'bold' : ''}
                >
                  {prop.proposition}
                </span>
                {isChecked && selectedOptions[index] && (
                  prop.isCorrect ? ' ✅' : ' ❌'
                )}
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

      {/* Affichage des messages de retour et complément de réponse */}
      {isChecked && (
        <div className="feedback-message">
          <p><strong>{feedbackMessage}</strong></p>
          {additionalMessage && <p>{additionalMessage}</p>}
        </div>
      )}
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
