import React, { useEffect } from 'react';
import { connectStateResults } from 'react-instantsearch-dom';

const CustomResults = ({ searchState, searchResults, children, onSearchResults }) => {
  useEffect(() => {
    if (searchResults) {
      onSearchResults(searchResults.results);
    }
  }, [searchResults, onSearchResults]);

  return (
    <div>
      {children}
    </div>
  );
};

export default connectStateResults(CustomResults);
