// ZoomContext.js
import React, { createContext, useState, useContext } from 'react';

const ZoomContext = createContext();

export const ZoomProvider = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <ZoomContext.Provider value={{ zoomLevel, setZoomLevel }}>
      {children}
    </ZoomContext.Provider>
  );
};

export const useZoom = () => useContext(ZoomContext);
