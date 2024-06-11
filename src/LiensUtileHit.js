// LiensUtileHit.js
import React from 'react';
import { Highlight } from 'react-instantsearch-dom';
import { HitIcon, SelectIcon } from './IconComponents';

const LiensUtileHit = ({ hit }) => (
  <li className="DocSearch-Hit" role="option" aria-selected="false">
    <a href={hit.url}>
      <div className="DocSearch-Hit-Container">
        <div className="DocSearch-Hit-icon">
          <HitIcon />
        </div>
        <div className="DocSearch-Hit-content-wrapper">
          <span className="DocSearch-Hit-title">
            <Highlight attribute="title" hit={hit} />
          </span>
          <span className="DocSearch-Hit-path">
            <Highlight attribute="description" hit={hit} />
          </span>
        </div>
        <div className="DocSearch-Hit-action">
          <SelectIcon />
        </div>
      </div>
    </a>
  </li>
);

export default LiensUtileHit;
