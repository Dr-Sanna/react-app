import React from 'react';
import HomePage from './HomePage';
import { SidebarProvider } from './SidebarContext';
import { ToggleProvider } from './ToggleContext';
import { DataProvider } from './DataContext';
import './App.css';
import './styles2.css';
import './markdown.css';

function App() {
  return (
    <SidebarProvider>
      <ToggleProvider>
      <DataProvider>
      <HomePage />
      </DataProvider>
      </ToggleProvider>
      </SidebarProvider>
  );
}

export default App;
