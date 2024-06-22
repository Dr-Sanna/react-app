import React, { useState, useRef, useEffect, memo } from 'react';
import './Accordion.css';

const Accordion = ({ title, content, selectedCas }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const content = contentRef.current;
    if (isOpen) {
      content.style.height = `${content.scrollHeight}px`;
    } else {
      content.style.height = '0px';
    }
  }, [isOpen]);

  useEffect(() => {
    const content = contentRef.current;
    content.style.height = '0px'; // Réinitialiser la hauteur à 0 lorsque selectedCas change
    setIsOpen(false); // Fermer l'accordéon
  }, [selectedCas]);

  return (
    <div className={`details_Nokh isBrowser_QrB5 alert alert--info details_Cn_P ${isOpen ? 'open' : ''}`}>
      <div className="accordion">
        <div className="accordion-header" onClick={handleToggle}>
          <span className="accordion-arrow"></span>
          {title}
        </div>
        <div className={`collapsible-wrapper ${isOpen ? 'open' : ''}`} ref={contentRef}>
          <div className="collapsibleContent_EoA1">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Accordion);
