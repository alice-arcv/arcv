import React, { useState } from 'react';
import { searchSneakers, extractAndSaveSneakerData } from '../services/googleSearchService';

function GoogleSneakerSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [savedSneakers, setSavedSneakers] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      return;
    }
    
    setIsSearching(true);
    setError('');
    
    try {
      console.log('Searching for:', searchTerm);
      
      // Search for sneakers
      const searchResults = await searchSneakers(searchTerm);
      console.log('Got search results:', searchResults);
      setResults(searchResults);
      
      // Process and save results to Firebase
      const sneakers = await extractAndSaveSneakerData(searchResults);
      setSavedSneakers(sneakers);
      
    } catch (error) {
      console.error('Search failed:', error);
      setError(`Search failed: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="google-sneaker-search">
      <form onSubmit={handleSearch}>
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for sneakers..."
            className="search-input"
            disabled={isSearching}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Let\'s Dig'}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {/* Fixed code with proper null checks */}
      {results && results.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <p>{savedSneakers ? savedSneakers.length : 0} new sneakers added to your database!</p>
          
          <div className="results-grid">
            {results.map((result, index) => (
              <div key={index} className="result-card">
                <h3>{result.title}</h3>
                <p>{result.snippet}</p>
                <a href={result.link} target="_blank" rel="noreferrer">View Source</a>
                {result.pagemap?.cse_image?.[0]?.src && (
                  <img 
                    src={result.pagemap.cse_image[0].src} 
                    alt={result.title}
                    style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GoogleSneakerSearch;