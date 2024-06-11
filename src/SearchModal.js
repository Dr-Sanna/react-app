import React, { useEffect, useCallback, useRef } from "react";
import { InstantSearch, connectSearchBox, Hits, connectStateResults, Index } from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";
import { SearchIcon, ResetIcon, LoadingIndicator, AlgoliaLogo, ArrowDownIcon, ArrowUpIcon, EnterKeyIcon, EscapeKeyIcon } from './IconComponents';
import LiensUtileHit from './LiensUtileHit';
import GuideCliniqueHit from './GuideCliniqueHit';
import CasCliniqueHit from './CasCliniqueHit';
import { indexes } from "./indexes"; // Importez vos index depuis le fichier

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_ADMIN_KEY
);

const Results = connectStateResults(({ searchState, searchResults, hitComponent }) => {
  const hasResults = searchResults && searchResults.nbHits !== 0;

  return searchState && searchState.query ? (
    <section className="DocSearch-Hits">
      <ul role="listbox" aria-labelledby="docsearch-label" id="docsearch-list">
        {hasResults ? (
          <Hits hitComponent={hitComponent} />
        ) : (
          <div>No results found</div>
        )}
      </ul>
    </section>
  ) : null;
});

const CustomSearchBox = ({ currentRefinement, isSearchStalled, refine }) => (
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
      onChange={(event) => refine(event.currentTarget.value)}
    />
    <button
      type="reset"
      title="Effacer la requête"
      className="DocSearch-Reset"
      aria-label="Effacer la requête"
      onClick={() => refine('')}
      hidden={!currentRefinement}
    >
      <ResetIcon />
    </button>
  </form>
);

const CustomSearchBoxConnected = connectSearchBox(CustomSearchBox);

const SearchModal = ({ onClose }) => {
  const modalRef = useRef(null);

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

  return (
    <div className="DocSearch DocSearch-Container">
      <div className="DocSearch-Modal" ref={modalRef}>
        <InstantSearch searchClient={searchClient} indexName={indexes[0].name}>
          <header className="DocSearch-SearchBar">
            <CustomSearchBoxConnected />
          </header>
          <div className="DocSearch-Dropdown">
            <div className="DocSearch-Dropdown-Container">
              <Index indexName="development_api::liens-utile.liens-utile">
                <Results hitComponent={(props) => <LiensUtileHit {...props} onClose={onClose} />} />
              </Index>
              <Index indexName="development_api::guide-clinique.guide-clinique">
                <Results hitComponent={(props) => <GuideCliniqueHit {...props} onClose={onClose} />} />
              </Index>
              <Index indexName="development_api::cas-clinique.cas-clinique">
                <Results hitComponent={(props) => <CasCliniqueHit {...props} onClose={onClose} />} />
              </Index>
            </div>
          </div>
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
