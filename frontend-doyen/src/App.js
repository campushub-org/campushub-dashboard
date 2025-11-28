// src/App.jsx

import React from 'react';
// Importez le nouveau Dashboard Doyen
import DeanDashboard from './pages/DeanDashboard'; 
// (Assurez-vous d'avoir bien créé ce fichier dans src/pages/)

function App() {
  // Rendu du Dashboard Doyen
  return (
    <div className="App">
      <DeanDashboard />
    </div>
  );
}

export default App;

