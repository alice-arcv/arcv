// frontend/src/components/TestSearch.jsx
import React, { useState } from 'react';
import { performGoogleSearch, extractAndSaveSneakerData } from '../services/googleSearchService';

const TestSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      console.log('Searching for:', searchTerm);
      const searchResults = await performGoogleSearch(searchTerm);
      console.log('Search returned:', searchResults);
      
      const processedResults = await extractAndSaveSneakerData(searchResults);
      console.log('Processed results:', processedResults);
      
      setResults(processedResults);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>Test Search</h1>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '300px' }}
        />
        <button onClick={handleSearch} style={{ marginLeft: '10px', padding: '10px 20px' }}>
          Search
        </button>
      </div>
      
      <div>
        <h2>Results ({results.length}):</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {results.map((result, index) => (
            <div key={index} style={{ border: '1px solid #444', borderRadius: '5px', padding: '10px' }}>
              <h3>{result.name}</h3>
              <div>{result.brand}</div>
              {result.imageUrl && (
                <img 
                  src={result.imageUrl} 
                  alt={result.name}
                  style={{ width: '100%', height: '200px', objectFit: 'contain' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestSearch;