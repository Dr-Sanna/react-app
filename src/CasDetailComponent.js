import React, { useState, useEffect } from 'react';
import CustomMarkdown from './CustomMarkdown';
import QuestionsComponent from './QuestionsComponent';  // Importez le composant QuestionsComponent

const CasDetailComponent = ({ selectedCas }) => {
  const [qcms, setQcms] = useState([]);
  const [partQuestions, setPartQuestions] = useState([]);
  const [isPart, setIsPart] = useState(false);

  useEffect(() => {
    if (selectedCas && selectedCas.attributes && selectedCas.attributes.test) {
      const testQcms = selectedCas.attributes.QCM || [];
      setQcms(testQcms);  // Récupérer les QCM

      const partTestQuestions = selectedCas.attributes.test.test || [];
      setPartQuestions(partTestQuestions);  // Récupérer les questions classiques

      setIsPart(true);  // Activer la partie pour les QCM et questions
    }
  }, [selectedCas]);

  if (!selectedCas || !selectedCas.attributes || !selectedCas.attributes.test) {
    return <div>Aucun cas clinique sélectionné.</div>;
  }

  const { test } = selectedCas.attributes;

  return (
    <div className="markdown">
      <h1>{test.titre}</h1>
      <CustomMarkdown markdownText={test.enonce} imageClass="custom-image" />
      <div style={{ margin: '20px 0' }}></div>

      {/* Utilisation de QuestionsComponent pour gérer les questions et les QCM */}
      <QuestionsComponent
        courseQuestions={[]}
        partQuestions={partQuestions}
        qcms={qcms}
        title={test.titre}
        isPart={isPart}
      />
    </div>
  );
};

export default React.memo(CasDetailComponent);
