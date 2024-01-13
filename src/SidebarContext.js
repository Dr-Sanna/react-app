import React, { createContext, useContext, useState } from 'react';

// Créer un contexte
export const SidebarContext = createContext();

// Fournisseur de contexte
export const SidebarProvider = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
  return (
    <SidebarContext.Provider value={{ isSidebarVisible, setIsSidebarVisible }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useSidebarContext = () => useContext(SidebarContext);
