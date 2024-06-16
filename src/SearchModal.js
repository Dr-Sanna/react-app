import React, { useEffect, useCallback, useRef, useState } from "react";
import { InstantSearch, connectSearchBox, Index, Hits, connectStateResults } from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";
import { SearchIcon, ResetIcon, LoadingIndicator, AlgoliaLogo, ArrowDownIcon, ArrowUpIcon, EnterKeyIcon, EscapeKeyIcon } from './IconComponents';
import GuideCliniqueHit from './GuideCliniqueHit';
import CasCliniqueHit from './CasCliniqueHit';

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_ADMIN_KEY
);

const indexPrefix = process.env.REACT_APP_ALGOLIA_INDEX_PREFIX;

const CustomSearchBox = ({ currentRefinement, isSearchStalled, refine, onChange }) => (
  <form className="DocSearch-Form">
    <label className="DocSearch-MagnifierLabel" htmlFor="docsearch-input" id="docsearch-label">
      <SearchIcon />
    </label>
    <div className="DocSearch-LoadingIndicator">
      {isSearchStalled ? <LoadingIndicator /> : null}
    </div>
    <input
      className="DocSearch-Input"
      aria-autocomplete="both"
      aria-labelledby="docsearch-label"
      id="docsearch-input"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      enterKeyHint="search"
      spellCheck="false"
      placeholder="Rechercher des docs"
      maxLength="64"
      type="search"
      value={currentRefinement}
      onChange={(event) => {
        refine(event.currentTarget.value);
        onChange(event);
      }}
    />
    <button
      type="reset"
      title="Effacer la requête"
      className="DocSearch-Reset"
      aria-label="Effacer la requête"
      onClick={() => {
        refine('');
        onChange({ target: { value: '' } });
      }}
      hidden={!currentRefinement}
    >
      <ResetIcon />
    </button>
  </form>
);

const CustomSearchBoxConnected = connectSearchBox(CustomSearchBox);

const Results = connectStateResults(({ searchState, searchResults, children }) => {
  const hasResults = searchResults && searchResults.nbHits !== 0;
  return searchState && searchState.query ? (
    <section className="DocSearch-Hits">
      <ul role="listbox" aria-labelledby="docsearch-label" id="docsearch-list">
        {hasResults ? children : null}
      </ul>
    </section>
  ) : null;
});

const NoResults = connectStateResults(({ searchState }) => {
  return !searchState.query || searchState.query.trim() === "" ? null : (
    <div className="DocSearch-NoResults">
      <div className="DocSearch-Screen-Icon">
        <svg width="40" height="40" viewBox="0 0 20 20" fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15.5 4.8c2 3 1.7 7-1 9.7h0l4.3 4.3-4.3-4.3a7.8 7.8 0 01-9.8 1m-2.2-2.2A7.8 7.8 0 0113.2 2.4M2 18L18 2"></path>
        </svg>
      </div>
      <p className="DocSearch-Title">Aucun résultat pour "<strong>{searchState.query}</strong>"</p>
    </div>
  );
});

const SearchModal = ({ onClose }) => {
  const modalRef = useRef(null);
  const [isQueryEmpty, setIsQueryEmpty] = useState(true);
  const [hasResults, setHasResults] = useState(true);

  const handleOutsideClick = useCallback(
    (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.body.classList.add("DocSearch--active");

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.body.classList.remove("DocSearch--active");
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const handleInputChange = (event) => {
    setIsQueryEmpty(event.target.value.trim() === "");
    setHasResults(true); // Reset results state when query changes
  };

  const handleSearchStateChange = ({ results }) => {
    const hasAnyResults = results && Object.values(results).some(result => result.nbHits > 0);
    setHasResults(hasAnyResults);
  };

  return (
    <div className="DocSearch DocSearch-Container">
      <div className="DocSearch-Modal" ref={modalRef}>
        <InstantSearch
          searchClient={searchClient}
          indexName={`${indexPrefix}::guide-clinique.guide-clinique`}
          onSearchStateChange={handleSearchStateChange}
        >
          <header className="DocSearch-SearchBar">
            <CustomSearchBoxConnected onChange={handleInputChange} />
          </header>
          {isQueryEmpty ? (
            <div className="DocSearch-StartScreen">
              <p className="DocSearch-Help">Commencez à taper pour rechercher...</p>
            </div>
          ) : (
            <div className="DocSearch-Dropdown">
              <div className="DocSearch-Dropdown-Container">
                <Index indexName={`${indexPrefix}::guide-clinique.guide-clinique`}>
                  <Results>
                    <Hits hitComponent={(props) => <GuideCliniqueHit {...props} onClose={onClose} />} />
                  </Results>
                </Index>
                <Index indexName={`${indexPrefix}::odontologie-pediatrique.odontologie-pediatrique`}>
                  <Results>
                    <Hits hitComponent={(props) => <GuideCliniqueHit {...props} onClose={onClose} />} />
                  </Results>
                </Index>
                <Index indexName={`${indexPrefix}::cas-clinique.cas-clinique`}>
                  <Results>
                    <Hits hitComponent={(props) => <CasCliniqueHit {...props} onClose={onClose} />} />
                  </Results>
                </Index>
                {!hasResults && <NoResults />}
              </div>
            </div>
          )}
        </InstantSearch>
        <footer className="DocSearch-Footer">
          <div className="DocSearch-Logo">
            <a
              href="https://www.algolia.com/ref/docsearch/?utm_source=docusaurus.io&amp;utm_medium=referral&amp;utm_content=powered_by&amp;utm_campaign=docsearch"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="DocSearch-Label">Recherche via</span>
              <AlgoliaLogo />
            </a>
          </div>
          <ul className="DocSearch-Commands">
            <li>
              <kbd className="DocSearch-Commands-Key">
                <EnterKeyIcon />
              </kbd>
              <span className="DocSearch-Label">sélectionner</span>
            </li>
            <li>
              <kbd className="DocSearch-Commands-Key">
                <ArrowDownIcon />
              </kbd>
              <kbd className="DocSearch-Commands-Key">
                <ArrowUpIcon />
              </kbd>
              <span className="DocSearch-Label">naviguer</span>
            </li>
            <li>
              <kbd className="DocSearch-Commands-Key">
                <EscapeKeyIcon />
              </kbd>
              <span className="DocSearch-Label">fermer</span>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
};

export default SearchModal;
