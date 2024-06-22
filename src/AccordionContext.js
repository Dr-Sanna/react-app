import React, { createContext, useContext, useState } from 'react';

const AccordionContext = createContext();

export const useAccordion = () => useContext(AccordionContext);

export const AccordionProvider = ({ children }) => {
  const [openIndices, setOpenIndices] = useState([]);

  const toggleAccordion = (index) => {
    setOpenIndices((prevOpenIndices) =>
      prevOpenIndices.includes(index)
        ? prevOpenIndices.filter((i) => i !== index)
        : [...prevOpenIndices, index]
    );
  };

  const resetAccordions = () => {
    setOpenIndices([]);
  };

  return (
    <AccordionContext.Provider value={{ openIndices, toggleAccordion, resetAccordions }}>
      {children}
    </AccordionContext.Provider>
  );
};
