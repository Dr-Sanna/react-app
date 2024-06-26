import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // Importez BrowserRouter
import Modal from 'react-modal'; // Importez Modal

Modal.setAppElement('#__docusaurus'); // Utilisez l'ID de l'élément racine

const root = ReactDOM.createRoot(document.getElementById('__docusaurus'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Enveloppez App avec BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
