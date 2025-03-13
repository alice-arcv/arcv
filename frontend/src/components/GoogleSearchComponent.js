// frontend/src/components/GoogleSearchComponent.js
import React, { useState } from 'react';
import { performGoogleSearch, extractAndSaveSneakerData } from '../services/googleSearchService';
import '../styles/figma-design.css';

const GoogleSearchComponent = ({ onSearchComplete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    try {
      setIsSearching(true);
      
      // Use the Google search service
      const searchResults = await performGoogleSearch(searchTerm);
      
      // Process and save the search results
      const processedSneakers = await extractAndSaveSneakerData(searchResults);
      
      // Notify parent component of search results
      if (onSearchComplete) {
        onSearchComplete(processedSneakers);
      }
      
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div className="figma-search-container">
      <form onSubmit={handleSubmit} className="figma-search-form">
        <input
          type="text"
          className="figma-search-input"
          placeholder="search for sneakers..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {isSearching && <div className="figma-search-loading">Searching...</div>}
      </form>
    </div>
  );
};

export default GoogleSearchComponent;