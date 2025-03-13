// frontend/src/App.js
import React from 'react';
import FigmaSearchInterface from './components/FigmaSearchInterface';
import ApiTester from './components/ApiTester'; // Import the tester
import './styles/arcv-figma.css';

function App() {
  return (
    <div className="App">
      <FigmaSearchInterface />
      <ApiTester /> {/* Add this line */}
    </div>
  );
}

export default App;