import React, { createContext, useContext, useState, useEffect } from 'react';

const ToggleContext = createContext();

export const useToggle = () => useContext(ToggleContext);

export const ToggleProvider = ({ children }) => {
  const [showQuestions, setShowQuestions] = useState(() => {
    return localStorage.getItem("showQuestions") === "true";
  });

  useEffect(() => {
    localStorage.setItem("showQuestions", showQuestions);
  }, [showQuestions]);

  return (
    <ToggleContext.Provider value={{ showQuestions, setShowQuestions }}>
      {children}
    </ToggleContext.Provider>
  );
};
