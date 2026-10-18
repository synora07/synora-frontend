// ============================================
// SYNORA - Einstiegspunkt
// ============================================
// Deine package.json sagt "react-scripts": "5.0.1" - das ist
// Create React App. Dort heisst der Einstiegspunkt index.js und
// muss genau hier liegen: src/index.js
//
// Diese Datei ERSETZT deine bisherige src/index.js.
//
// Was raus ist gegenueber der Standard-Datei von CRA:
// reportWebVitals. Das misst Ladezeiten und schickt sie
// nirgendwohin, solange man keine Funktion uebergibt - es ist
// also toter Code. Brauchst du es spaeter, kommt es mit zwei
// Zeilen zurueck.
// ============================================

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css';

const wurzel = document.getElementById('root');

if (!wurzel) {
  // Ohne diesen Hinweis bekommst du eine weisse Seite ohne
  // jeden Anhaltspunkt, was fehlt.
  console.error('[synora] Kein Element mit id="root" gefunden. Pruef public/index.html.');
} else {
  createRoot(wurzel).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
