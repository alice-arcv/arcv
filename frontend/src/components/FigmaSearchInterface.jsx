// frontend/src/components/FigmaSearchInterface.jsx
import React, { useState, useEffect } from 'react';
// Import the search integration service
import { searchSneakers } from '../services/searchIntegration';
// Import only the consolidated CSS file
import '../styles/arcv-figma.css';
// Import the logo with the correct filename
import logoImage from '../images/arcv-logo.png';
// Import the chevron icon
import chevronIcon from '../images/chevron-icon.png';
// Import the ProductDetail component
import ProductDetail from './ProductDetail';
// Import the SaveToFolderPopup component
import SaveToFolderPopup from './SaveToFolderPopup';
// Import the ProfileDropdown component
import ProfileDropdown from './ProfileDropdown';

const FigmaSearchInterface = ({ savedFolders, savedProducts, onCreateFolder, onSaveProduct, onGoToFolders, onGoToImageSearch }) => {
  // State for search and results
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [sortedDisplayResults, setSortedDisplayResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState(null); // Default to material being expanded
  const [filters, setFilters] = useState({
    gender: [],
    age: [],
    color: [],
    brand: [],
    material: [],
    price: { min: null, max: null }
  });
  
  // State for product detail view
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  // State for hover and save functionality
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedForSave, setSelectedForSave] = useState(null);
  
  // Sorting state
  const [sortOption, setSortOption] = useState('newest');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  
  // Toggle filter sidebar visibility with layout recalculation
  const toggleFilterSidebar = () => {
    setIsFilterVisible(!isFilterVisible);
    
    // Force layout recalculation after state update
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300); // Wait for transition to complete (300ms)
  };

  // Toggle filter expansion
  const toggleFilterExpansion = (filterName) => {
    if (expandedFilter === filterName) {
      setExpandedFilter(null); // Collapse if already expanded
    } else {
      setExpandedFilter(filterName); // Expand the clicked filter
    }
  };
  
  // Handle sort selection
  const handleSortChange = (option) => {
    setSortOption(option);
    setSortMenuOpen(false);
  };
  
  // Handle search when Enter key is pressed
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle search button click with enhanced debugging
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    // Handle special commands
    const trimmedTerm = searchTerm.trim().toLowerCase();
    
    if (trimmedTerm === '/myarchive') {
      onGoToFolders();
      return;
    }
    
    if (trimmedTerm === '/dna') {
      onGoToImageSearch();
      return;
    }
    
    setLoading(true);
    console.log('=== SEARCH STARTED ===');
    console.log('Searching for:', searchTerm);
    console.log('With filters:', JSON.stringify(filters));
    
    try {
      // Log which service we're using
      console.log('Calling searchSneakers from searchIntegration.js');
      
      const searchResults = await searchSneakers(searchTerm, filters);
      console.log('Search complete! Results:', searchResults);
      console.log('Results source:', searchResults.source);
      console.log('Number of results:', searchResults.results?.length || 0);
      
      // Set the results
      setResults(searchResults.results || []);
      
      // Log the first few results for debugging
      if (searchResults.results && searchResults.results.length > 0) {
        console.log('Sample of first result:', {
          id: searchResults.results[0].id,
          name: searchResults.results[0].name,
          brand: searchResults.results[0].brand,
          tags: searchResults.results[0].tags
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
      console.log('=== SEARCH COMPLETED ===');
    }
  };

  // Handle multiple selection filter changes
  const handleFilterChange = (filterType, value) => {
    console.log(`Toggling ${filterType} filter with value:`, value);
    setFilters(prev => {
      const currentValues = [...prev[filterType]];
      
      // If value is already selected, remove it; otherwise, add it
      const valueIndex = currentValues.indexOf(value);
      if (valueIndex > -1) {
        currentValues.splice(valueIndex, 1);
      } else {
        currentValues.push(value);
      }
      
      return {
        ...prev,
        [filterType]: currentValues
      };
    });
  };
  
  // Handle price range changes
  const handlePriceChange = (type, value) => {
    const parsedValue = value ? parseInt(value) : null;
    setFilters(prev => ({
      ...prev,
      price: {
        ...prev.price,
        [type]: parsedValue
      }
    }));
  };

  // Handle product selection for detail view
  const handleProductSelect = (product) => {
    console.log('Selected product:', product);
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  // Handle product hover
  const handleProductHover = (productId) => {
    setHoveredProduct(productId);
  };

  // Handle save to folder
  const handleSaveToFolder = (productId, folderId) => {
    // Save product to the selected folder
    onSaveProduct(productId, folderId);
    
    // For demo purposes - you can replace with a toast notification in a real app
    console.log(`Product ${productId} saved to folder ${folderId}`);
  };

  // Handle filter changes
  useEffect(() => {
    if (searchTerm.trim()) {
      console.log('Filters changed, running search again with term:', searchTerm);
      handleSearch();
    }
  }, [filters]);

  // Apply sorting whenever results or sortOption changes
  useEffect(() => {
    let sorted = [...results];
    switch(sortOption) {
      case 'newest':
        sorted.sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
        break;
      case 'oldest':
        sorted.sort((a, b) => (a.releaseDate || '').localeCompare(b.releaseDate || ''));
        break;
      case 'price-asc':
        sorted.sort((a, b) => (parseFloat(a.retailPrice) || 0) - (parseFloat(b.retailPrice) || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (parseFloat(b.retailPrice) || 0) - (parseFloat(a.retailPrice) || 0));
        break;
      default:
        sorted.sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
    }
    
    // Filter out items with missing or placeholder images
    const placeholderUrl = 'https://via.placeholder.com/300x300/eeeeee/333333?text=No+Image';
    const filteredSorted = sorted.filter(sneaker => {
      // Remove items where imageUrl is falsy, points to the placeholder, or contains "X" pattern URLs
      return sneaker.imageUrl && 
             sneaker.imageUrl !== placeholderUrl && 
             !sneaker.imageUrl.includes('/X/') &&
             !sneaker.imageUrl.includes('/x/');
    });
    
    setSortedDisplayResults(filteredSorted);
    console.log(`Sorting applied: ${sortOption}, Results count: ${filteredSorted.length} (filtered from ${sorted.length})`);
  }, [results, sortOption]); // Run when results or sortOption changes

  // Render the component - conditionally show product detail or search interface
  return (
    <>
      {showProductDetail ? (
        <ProductDetail 
          product={selectedProduct} 
          onBack={() => setShowProductDetail(false)}
        />
      ) : (
        <div className="figma-container">
          {/* Header with logo and search */}
          <div className="figma-header">
            {/* Logo in the corner */}
            <div className="figma-logo">
              <img src={logoImage} alt="ARCV Logo" className="figma-logo-image" />
            </div>
            
            {/* Search input centered with filter toggle and sort button inside */}
            <div className="figma-search">
              <input
                type="text"
                className="figma-search-input"
                placeholder="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              
              {/* Sort and filter icons inside the search input */}
              <div className="search-icons">
                {/* Filter toggle button */}
                <div 
                  className={`filter-icon filter-toggle ${isFilterVisible ? 'active-filter' : ''}`}
                  onClick={toggleFilterSidebar}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14H7M9 8H15M17 16H23" 
                          stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Sort dropdown button - Updated to match Figma reference with up/down arrows */}
                <div className="sort-icon" onClick={() => setSortMenuOpen(!sortMenuOpen)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 14l5 5 5-5M7 10l5-5 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  
                  {/* Sort dropdown menu */}
                  {sortMenuOpen && (
                    <div className="sort-dropdown">
                      <div className={`sort-option ${sortOption === 'newest' ? 'active' : ''}`} 
                           onClick={() => handleSortChange('newest')}>
                        Newest First
                      </div>
                      <div className={`sort-option ${sortOption === 'oldest' ? 'active' : ''}`} 
                           onClick={() => handleSortChange('oldest')}>
                        Oldest First
                      </div>
                      <div className={`sort-option ${sortOption === 'price-asc' ? 'active' : ''}`} 
                           onClick={() => handleSortChange('price-asc')}>
                        Price: Low to High
                      </div>
                      <div className={`sort-option ${sortOption === 'price-desc' ? 'active' : ''}`} 
                           onClick={() => handleSortChange('price-desc')}>
                        Price: High to Low
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Control buttons on the right - REMOVED THE CONTROL BUTTON */}
            <div className="figma-controls">
              {/* ProfileDropdown component with onGoToFolders prop */}
              <ProfileDropdown onGoToFolders={onGoToFolders} />
            </div>
          </div>
          
          {/* Main content area */}
          <div className="figma-content">
            {/* Main layout with filters and results */}
            <div className="figma-main">
              {/* Left sidebar with filters - with toggle visibility */}
              <div className={`figma-sidebar ${isFilterVisible ? 'visible' : 'hidden'}`}>
                {/* Gender filter - just label with expandable section */}
                <div className="figma-filter-section">
                  <div 
                    className="figma-filter-label"
                    onClick={() => toggleFilterExpansion('gender')}
                    data-expanded={expandedFilter === 'gender'}
                  >
                    gender
                    <span className="figma-filter-arrow">
                      <img 
                        src={chevronIcon} 
                        alt="toggle" 
                        className={`chevron-icon ${expandedFilter === 'gender' ? 'chevron-down' : 'chevron-right'}`}
                      />
                    </span>
                  </div>
                  {expandedFilter === 'gender' && (
                    <div className="figma-filter-content">
                      <div className="figma-checkbox-group">
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="men" 
                            className="figma-checkbox"
                            checked={filters.gender.includes('men')}
                            onChange={() => handleFilterChange('gender', 'men')}
                          />
                          <label htmlFor="men" className="figma-checkbox-label">Men</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="women" 
                            className="figma-checkbox"
                            checked={filters.gender.includes('women')}
                            onChange={() => handleFilterChange('gender', 'women')}
                          />
                          <label htmlFor="women" className="figma-checkbox-label">Women</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="unisex" 
                            className="figma-checkbox"
                            checked={filters.gender.includes('unisex')}
                            onChange={() => handleFilterChange('gender', 'unisex')}
                          />
                          <label htmlFor="unisex" className="figma-checkbox-label">Unisex</label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Age filter - just label with expandable section */}
                <div className="figma-filter-section">
                  <div 
                    className="figma-filter-label"
                    onClick={() => toggleFilterExpansion('age')}
                    data-expanded={expandedFilter === 'age'}
                  >
                    age
                    <span className="figma-filter-arrow">
                      <img 
                        src={chevronIcon} 
                        alt="toggle" 
                        className={`chevron-icon ${expandedFilter === 'age' ? 'chevron-down' : 'chevron-right'}`}
                      />
                    </span>
                  </div>
                  {expandedFilter === 'age' && (
                    <div className="figma-filter-content">
                      <div className="figma-checkbox-group">
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="adult" 
                            className="figma-checkbox"
                            checked={filters.age.includes('adult')}
                            onChange={() => handleFilterChange('age', 'adult')}
                          />
                          <label htmlFor="adult" className="figma-checkbox-label">Adult</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="youth" 
                            className="figma-checkbox"
                            checked={filters.age.includes('youth')}
                            onChange={() => handleFilterChange('age', 'youth')}
                          />
                          <label htmlFor="youth" className="figma-checkbox-label">Youth</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="toddler" 
                            className="figma-checkbox"
                            checked={filters.age.includes('toddler')}
                            onChange={() => handleFilterChange('age', 'toddler')}
                          />
                          <label htmlFor="toddler" className="figma-checkbox-label">Toddler</label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Color filter - just label with expandable section */}
                <div className="figma-filter-section">
                  <div 
                    className="figma-filter-label"
                    onClick={() => toggleFilterExpansion('color')}
                    data-expanded={expandedFilter === 'color'}
                  >
                    color
                    <span className="figma-filter-arrow">
                      <img 
                        src={chevronIcon} 
                        alt="toggle" 
                        className={`chevron-icon ${expandedFilter === 'color' ? 'chevron-down' : 'chevron-right'}`}
                      />
                    </span>
                  </div>
                  {expandedFilter === 'color' && (
                    <div className="figma-filter-content">
                      <div className="figma-checkbox-group">
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="black" 
                            className="figma-checkbox"
                            checked={filters.color.includes('black')}
                            onChange={() => handleFilterChange('color', 'black')}
                          />
                          <label htmlFor="black" className="figma-checkbox-label">Black</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="white" 
                            className="figma-checkbox"
                            checked={filters.color.includes('white')}
                            onChange={() => handleFilterChange('color', 'white')}
                          />
                          <label htmlFor="white" className="figma-checkbox-label">White</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="red" 
                            className="figma-checkbox"
                            checked={filters.color.includes('red')}
                            onChange={() => handleFilterChange('color', 'red')}
                          />
                          <label htmlFor="red" className="figma-checkbox-label">Red</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="blue" 
                            className="figma-checkbox"
                            checked={filters.color.includes('blue')}
                            onChange={() => handleFilterChange('color', 'blue')}
                          />
                          <label htmlFor="blue" className="figma-checkbox-label">Blue</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="brown" 
                            className="figma-checkbox"
                            checked={filters.color.includes('brown')}
                            onChange={() => handleFilterChange('color', 'brown')}
                          />
                          <label htmlFor="brown" className="figma-checkbox-label">Brown</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="green" 
                            className="figma-checkbox"
                            checked={filters.color.includes('green')}
                            onChange={() => handleFilterChange('color', 'green')}
                          />
                          <label htmlFor="green" className="figma-checkbox-label">Green</label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Brand filter - just label with expandable section */}
                <div className="figma-filter-section">
                  <div 
                    className="figma-filter-label"
                    onClick={() => toggleFilterExpansion('brand')}
                    data-expanded={expandedFilter === 'brand'}
                  >
                    brand
                    <span className="figma-filter-arrow">
                      <img 
                        src={chevronIcon} 
                        alt="toggle" 
                        className={`chevron-icon ${expandedFilter === 'brand' ? 'chevron-down' : 'chevron-right'}`}
                      />
                    </span>
                  </div>
                  {expandedFilter === 'brand' && (
                    <div className="figma-filter-content">
                      <div className="figma-checkbox-group">
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="nike" 
                            className="figma-checkbox"
                            checked={filters.brand.includes('nike')}
                            onChange={() => handleFilterChange('brand', 'nike')}
                          />
                          <label htmlFor="nike" className="figma-checkbox-label">Nike</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="adidas" 
                            className="figma-checkbox"
                            checked={filters.brand.includes('adidas')}
                            onChange={() => handleFilterChange('brand', 'adidas')}
                          />
                          <label htmlFor="adidas" className="figma-checkbox-label">Adidas</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="jordan" 
                            className="figma-checkbox"
                            checked={filters.brand.includes('jordan')}
                            onChange={() => handleFilterChange('brand', 'jordan')}
                          />
                          <label htmlFor="jordan" className="figma-checkbox-label">Jordan</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="newbalance" 
                            className="figma-checkbox"
                            checked={filters.brand.includes('newbalance')}
                            onChange={() => handleFilterChange('brand', 'newbalance')}
                          />
                          <label htmlFor="newbalance" className="figma-checkbox-label">New Balance</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="puma" 
                            className="figma-checkbox"
                            checked={filters.brand.includes('puma')}
                            onChange={() => handleFilterChange('brand', 'puma')}
                          />
                          <label htmlFor="puma" className="figma-checkbox-label">Puma</label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Material filter - expanded with checkboxes by default */}
                <div className="figma-filter-section">
                  <div 
                    className="figma-filter-label"
                    onClick={() => toggleFilterExpansion('material')}
                    data-expanded={expandedFilter === 'material'}
                  >
                    material
                    <span className="figma-filter-arrow">
                      <img 
                        src={chevronIcon} 
                        alt="toggle" 
                        className={`chevron-icon ${expandedFilter === 'material' ? 'chevron-down' : 'chevron-right'}`}
                      />
                    </span>
                  </div>
                  {expandedFilter === 'material' && (
                    <div className="figma-filter-content">
                      <div className="figma-checkbox-group">
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="leather" 
                            className="figma-checkbox"
                            checked={filters.material.includes("Leather")}
                            onChange={() => handleFilterChange('material', "Leather")}
                          />
                          <label htmlFor="leather" className="figma-checkbox-label">Leather</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="bio-leather" 
                            className="figma-checkbox"
                            checked={filters.material.includes("Bio Leather")}
                            onChange={() => handleFilterChange('material', "Bio Leather")}
                          />
                          <label htmlFor="bio-leather" className="figma-checkbox-label">Bio Leather</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="textile" 
                            className="figma-checkbox"
                            checked={filters.material.includes("Textile")}
                            onChange={() => handleFilterChange('material', "Textile")}
                          />
                          <label htmlFor="textile" className="figma-checkbox-label">Textile</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="rubber" 
                            className="figma-checkbox"
                            checked={filters.material.includes("Rubber")}
                            onChange={() => handleFilterChange('material', "Rubber")}
                          />
                          <label htmlFor="rubber" className="figma-checkbox-label">Rubber</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="nonwoven" 
                            className="figma-checkbox"
                            checked={filters.material.includes("Nonwoven")}
                            onChange={() => handleFilterChange('material', "Nonwoven")}
                          />
                          <label htmlFor="nonwoven" className="figma-checkbox-label">Nonwoven</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="synthetic" 
                            className="figma-checkbox"
                            checked={filters.material.includes("Synthetic")}
                            onChange={() => handleFilterChange('material', "Synthetic")}
                          />
                          <label htmlFor="synthetic" className="figma-checkbox-label">Synthetic</label>
                        </div>
                        <div className="figma-checkbox-item">
                          <input 
                            type="checkbox" 
                            id="recycled" 
                            className="figma-checkbox"
                            checked={filters.material.includes("Recycled Content")}
                            onChange={() => handleFilterChange('material', "Recycled Content")}
                          />
                          <label htmlFor="recycled" className="figma-checkbox-label">Recycled Content</label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Price filter - just label with expandable section */}
                <div className="figma-filter-section">
                  <div 
                    className="figma-filter-label"
                    onClick={() => toggleFilterExpansion('price')}
                    data-expanded={expandedFilter === 'price'}
                  >
                    price
                    <span className="figma-filter-arrow">
                      <img 
                        src={chevronIcon} 
                        alt="toggle" 
                        className={`chevron-icon ${expandedFilter === 'price' ? 'chevron-down' : 'chevron-right'}`}
                      />
                    </span>
                  </div>
                  {expandedFilter === 'price' && (
                    <div className="figma-filter-content">
                      <div className="figma-price-range">
                        <input 
                          type="number" 
                          className="figma-price-input"
                          placeholder="Min"
                          value={filters.price.min || ''}
                          onChange={(e) => handlePriceChange('min', e.target.value)}
                        />
                        <span>-</span>
                        <input 
                          type="number" 
                          className="figma-price-input"
                          placeholder="Max"
                          value={filters.price.max || ''}
                          onChange={(e) => handlePriceChange('max', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right side content with results */}
              <div className={`figma-results ${!isFilterVisible ? 'full-width' : ''}`}>
                {loading ? (
                  <div className="figma-loading">
                    <div className="figma-spinner"></div>
                    <p>Searching for sneakers...</p>
                  </div>
                ) : (
                  <div className={`figma-grid ${!isFilterVisible ? 'five-column' : 'four-column'}`}>
                    {sortedDisplayResults.map((sneaker) => (
                      <div
                        key={sneaker.id}
                        className="figma-product-card"
                        onClick={() => handleProductSelect(sneaker)}
                        onMouseEnter={() => handleProductHover(sneaker.id)}
                        onMouseLeave={() => handleProductHover(null)}
                      >
                        <div className="figma-product-image">
                          <img
                            src={sneaker.imageUrl}
                            alt={sneaker.name}
                            onError={(e) => {
                              console.error('Image failed to load:', sneaker.imageUrl);
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/300x300/eeeeee/333333?text=No+Image';
                            }}
                          />
                          {hoveredProduct === sneaker.id && (
                            <div className="figma-product-actions">
                              <button 
                                className="figma-save-btn"
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setSelectedForSave(sneaker.id); 
                                }}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="figma-product-info">
                          <h3 className="figma-product-title">{sneaker.name || 'AIR JORDAN 1'}</h3>
                          <div className="figma-product-subtitle">{sneaker.subtitle || '[Retro High OG/Palomino]'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Folder selection popup */}
          {selectedForSave && (
            <div 
              className="figma-popup-overlay"
              onClick={() => setSelectedForSave(null)}
            >
              <div 
                className="figma-popup-container"
                onClick={(e) => e.stopPropagation()}
              >
                <SaveToFolderPopup 
                  folders={savedFolders}
                  onClose={() => setSelectedForSave(null)}
                  onSave={(folderId) => handleSaveToFolder(selectedForSave, folderId)}
                  onCreateFolder={onCreateFolder}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FigmaSearchInterface;
