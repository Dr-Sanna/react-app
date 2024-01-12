import React, { useState, useRef, useEffect } from 'react';

const CustomAccordion = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const currentContent = contentRef.current;
    if (!currentContent) return;

    const updateHeight = () => {
      currentContent.style.height = isOpen ? `${currentContent.scrollHeight}px` : '0px';
    };

    const transitionEnd = () => {
      if (isOpen) {
        currentContent.style.height = 'auto';
      }
      currentContent.removeEventListener('transitionend', transitionEnd);
    };

    currentContent.addEventListener('transitionend', transitionEnd);

    updateHeight();

    return () => {
      currentContent.removeEventListener('transitionend', transitionEnd);
    };
  }, [isOpen]);

  const toggleAccordion = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <details 
      className="details_Nokh isBrowser_QrB5 alert alert--info details_Cn_P"
      data-collapsed={!isOpen}
      open={isOpen}
      onClick={toggleAccordion}
    >
      <summary>{title}</summary>
      <div 
        ref={contentRef} 
        style={{ 
          height: '0px', 
          overflow: 'hidden', 
          transition: 'height 318ms ease-in-out' 
        }}
      >
        {content}
      </div>
    </details>
  );
};

export default CustomAccordion;
