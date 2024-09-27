// DocumentationPage.js
import React from 'react';
import DisplayItems from './DisplayItems';
import { useContext } from 'react';
import { DataContext } from './DataContext';

const DocumentationPage = () => {
  const { matieres } = useContext(DataContext);

  return (
    <div className="documentation-page">
      <h1>Documentation</h1>
      <p>Accédez à une vaste documentation couvrant divers sujets en dentisterie.</p>
      <DisplayItems items={matieres} isMatiere={true} />
    </div>
  );
};

export default DocumentationPage;
