// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import GoogleSearchComponent from '../components/GoogleSearchComponent';
import SneakerCard from '../components/SneakerCard';
import './HomePage.css';

function HomePage() {
  const [sneakers, setSneakers] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(true); // Add state for filter visibility
  
  // Add filter states
  const [filters, setFilters] = useState({
    gender: '',
    age: '',
    color: '',
    brand: '',
    material: [],
    price: { min: null, max: null },
    market: '',
    year: ''
  });
  
  // Toggle filter sidebar
  const toggleFilterSidebar = () => {
    setIsFilterVisible(!isFilterVisible);
  };
  
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  // Handle material checkbox changes
  const handleMaterialChange = (material, isChecked) => {
    setFilters(prev => {
      const materials = [...prev.material];
      
      if (isChecked) {
        materials.push(material);
      } else {
        const index = materials.indexOf(material);
        if (index > -1) {
          materials.splice(index, 1);
        }
      }
      
      return {
        ...prev,
        material: materials
      };
    });
  };
  
  // Handle price range changes
  const handlePriceChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      price: {
        ...prev.price,
        [type]: value ? parseInt(value) : null
      }
    }));
  };
  
  // Handle search results
  const handleSearchComplete = (results) => {
    if (results && results.length > 0) {
      setSneakers(results);
    }
  };
  
  // Apply filters when they change
  useEffect(() => {
    // Here you would typically call your search function with the updated filters
    // For demonstration purposes, we're just logging the filters
    console.log('Filters updated:', filters);
    // Call your search API with filters here
  }, [filters]);
  
  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="logo">
          A<span className="logo-small">r</span>c<span className="logo-small">V</span>
        </div>
        
        {/* Use the GoogleSearchComponent */}
        <GoogleSearchComponent onSearchComplete={handleSearchComplete} />
        
        <div className="controls">
          <button className="control-btn">^</button>
          <button 
            className="control-btn filter-toggle"
            onClick={toggleFilterSidebar}
          >
            ≡
          </button>
          <div className="profile">👤</div>
        </div>
      </div>
      
      {/* Main content with conditional sidebar */}
      <div className="content">
        {/* Sidebar with conditional class */}
        <div className={`sidebar ${isFilterVisible ? 'visible' : 'hidden'}`}>
          {/* Filter sections */}
          <div className="filter-group">
            <div className="filter-label">gender</div>
            <select 
              value={filters.gender} 
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            >
              <option value="">All</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          
          <div className="filter-group">
            <div className="filter-label">age</div>
            <select 
              value={filters.age} 
              onChange={(e) => handleFilterChange('age', e.target.value)}
            >
              <option value="">All</option>
              <option value="adult">Adult</option>
              <option value="youth">Youth</option>
              <option value="toddler">Toddler</option>
            </select>
          </div>
          
          <div className="filter-group">
            <div className="filter-label">color</div>
            <select 
              value={filters.color} 
              onChange={(e) => handleFilterChange('color', e.target.value)}
            >
              <option value="">All</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="brown">Brown</option>
              <option value="green">Green</option>
            </select>
          </div>
          
          <div className="filter-group">
            <div className="filter-label">brand</div>
            <select 
              value={filters.brand} 
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            >
              <option value="">All</option>
              <option value="nike">Nike</option>
              <option value="adidas">Adidas</option>
              <option value="jordan">Jordan</option>
              <option value="newbalance">New Balance</option>
              <option value="puma">Puma</option>
            </select>
          </div>
          
          <div className="filter-group">
            <div className="filter-label">material</div>
            <div className="checkbox-group">
              {['Leather', 'Suede', 'Canvas', 'Mesh', 'Synthetic', 'Knit'].map(material => (
                <div className="checkbox-option" key={material}>
                  <input 
                    type="checkbox" 
                    id={`material-${material}`}
                    checked={filters.material.includes(material)}
                    onChange={(e) => handleMaterialChange(material, e.target.checked)}
                  />
                  <label htmlFor={`material-${material}`}>{material}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <div className="filter-label">price</div>
            <div className="price-range">
              <input 
                type="number" 
                placeholder="Min"
                value={filters.price.min || ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
              />
              <span>-</span>
              <input 
                type="number" 
                placeholder="Max"
                value={filters.price.max || ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
              />
            </div>
          </div>
          
          <div className="filter-group">
            <div className="filter-label">market</div>
            <select 
              value={filters.market} 
              onChange={(e) => handleFilterChange('market', e.target.value)}
            >
              <option value="">All</option>
              <option value="stockx">StockX</option>
              <option value="goat">GOAT</option>
              <option value="flightclub">Flight Club</option>
            </select>
          </div>
          
          <div className="filter-group">
            <div className="filter-label">year</div>
            <select 
              value={filters.year} 
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <option value="">All</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="older">Older</option>
            </select>
          </div>
        </div>
        
        {/* Main content */}
        <div className="main">
          <div className="sneaker-grid">
            {sneakers.map(sneaker => (
              <SneakerCard key={sneaker.id || `sneaker-${Math.random()}`} sneaker={sneaker} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;