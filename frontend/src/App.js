import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ArchivePage from './pages/ArchivePage';
import FirebaseTest from './components/FirebaseTest';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <HomePage />
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                  <FirebaseTest />
                </div>
              </>
            } />
            <Route path="/archive" element={<ArchivePage />} />
            {/* Add more routes as you create more pages */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;