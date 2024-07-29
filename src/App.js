import React, { useState } from 'react';
import HomePage from './HomePage';
import { SidebarProvider } from './SidebarContext';
import { ToggleProvider } from './ToggleContext';
import { DataProvider } from './DataContext';
import CustomNavbar from './CustomNavbar';

import './App.css';
import './styles2.css';
import './markdown.css';

function App() {
  const [fontSize, setFontSize] = useState(100);

  return (
    <div id="zoom-container">
      <SidebarProvider>
        <ToggleProvider>
          <DataProvider>
            <CustomNavbar setFontSize={setFontSize} />
            <HomePage fontSize={fontSize} />
          </DataProvider>
        </ToggleProvider>
      </SidebarProvider>
    </div>
  );
}

export default App;
