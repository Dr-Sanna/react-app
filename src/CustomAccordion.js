import React, { useEffect, useRef } from 'react';

const CustomAccordion = ({ title, content, isOpen, onToggle }) => {
  const detailsRef = useRef(null);

  useEffect(() => {
    if (detailsRef.current) {
      if (isOpen) {
        detailsRef.current.setAttribute('open', '');
      } else {
        detailsRef.current.removeAttribute('open');
      }
    }
  }, [isOpen]);

  const handleToggle = (e) => {
    e.preventDefault();
    onToggle();
  };

  return (
    <details 
      ref={detailsRef}
      className={`details_Nokh isBrowser_QrB5 alert alert--info details_Cn_P`} 
      data-collapsed={isOpen ? "false" : "true"}
    >
      <summary onClick={handleToggle}>
        {title}
      </summary>
      <div className="collapsibleContent_EoA1">
        {content}
      </div>
    </details>
  );
};

export default CustomAccordion;
