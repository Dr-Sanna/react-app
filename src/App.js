import React from 'react';
import HomePage from './HomePage';
import { SidebarProvider } from './SidebarContext';
import './App.css';
import './styles2.css';


function App() {
  return (
    <SidebarProvider>
      <HomePage />
      </SidebarProvider>
  );
}

export default App;
