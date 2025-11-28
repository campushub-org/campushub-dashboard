
// src/App.jsx

import React from 'react';
import StudentDashboard from './pages/StudentDashboard'; 
// Si vous aviez la Landing Page, assurez-vous de commenter ou supprimer les imports de Header, HeroSection, etc.

function App() {
  // Affiche le Tableau de Bord Étudiant
  return (
    <div className="App">
      <StudentDashboard />
    </div>
  );
}

export default App;
	
