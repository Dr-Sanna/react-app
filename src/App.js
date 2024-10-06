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
  return (
    <SidebarProvider>
      <ToggleProvider>
        <DataProvider>
          <CustomNavbar />
          <div className="main-content">
            <HomePage />
          </div>
        </DataProvider>
      </ToggleProvider>
    </SidebarProvider>
  );
}

export default App;

