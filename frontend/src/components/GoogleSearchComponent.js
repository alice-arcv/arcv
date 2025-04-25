// frontend/src/components/GoogleSearchComponent.js
import React, { useState } from 'react';
import { searchSneakers } from '../services/mockDataService';
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
      
      // Use the mock data service instead of Google search
      const searchResults = await searchSneakers(searchTerm);
      
      // Notify parent component of search results
      if (onSearchComplete) {
        onSearchComplete(searchResults.results || []);
      }
      
      console.log(`Found ${searchResults.results?.length || 0} results from mock data`);
      
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