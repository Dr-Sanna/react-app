import React from 'react';
import { connectStateResults } from 'react-instantsearch-dom';

const CustomResults = ({ searchState, searchResults, allSearchResults, children }) => {
  const hasResults =
    allSearchResults &&
    Object.values(allSearchResults).some((results) => results && results.nbHits !== 0);

  return searchState && searchState.query ? (
    <section className="DocSearch-Hits">
      {hasResults ? (
        children
      ) : (
        <div>Aucun résultat trouvé</div>
      )}
    </section>
  ) : null;
};

export default connectStateResults(CustomResults);
