import React, { createContext, useContext, useState, useEffect } from 'react';

const ToggleContext = createContext();

export const useToggle = () => useContext(ToggleContext);

export const ToggleProvider = ({ children }) => {
  const [showQuestions, setShowQuestions] = useState(() => {
    return localStorage.getItem("showQuestions") === "true";
  });
  const [showVoiceReader, setShowVoiceReader] = useState(() => {
    return localStorage.getItem("showVoiceReader") === "true";
  });

  useEffect(() => {
    localStorage.setItem("showQuestions", showQuestions);
  }, [showQuestions]);

  useEffect(() => {
    localStorage.setItem("showVoiceReader", showVoiceReader);
  }, [showVoiceReader]);

  return (
    <ToggleContext.Provider value={{ showQuestions, setShowQuestions, showVoiceReader, setShowVoiceReader }}>
      {children}
    </ToggleContext.Provider>
  );
};
