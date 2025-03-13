// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import GoogleSearchComponent from '../components/GoogleSearchComponent';
import SneakerCard from '../components/SneakerCard';
import '../styles/figma-design.css';

function HomePage() {
  const [sneakers, setSneakers] = useState([]);
  
  // Handle search results
  const handleSearchComplete = (results) => {
    if (results && results.length > 0) {
      // Update sneakers state with the new results
      setSneakers(results);
    }
  };
  
  return (
    <div className="figma-layout">
      {/* Header */}
      <div className="figma-header">
        <div className="figma-logo">
          A<span className="figma-logo-small">r</span>c<span className="figma-logo-small">V</span>
        </div>
        
        {/* Use the GoogleSearchComponent */}
        <GoogleSearchComponent onSearchComplete={handleSearchComplete} />
        
        <div className="figma-controls">
          <button className="figma-control-btn">^</button>
          <button className="figma-control-btn">=</button>
          <button className="figma-control-btn">□</button>
          <div className="figma-profile">👤</div>
        </div>
      </div>
      
      {/* Display search results */}
      <div className="figma-results">
        {sneakers.length > 0 ? (
          <div className="figma-sneaker-grid">
            {sneakers.map(sneaker => (
              <SneakerCard key={sneaker.id || `sneaker-${Math.random()}`} sneaker={sneaker} />
            ))}
          </div>
        ) : (
          <div className="figma-no-results">
            Search for sneakers to view results
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;