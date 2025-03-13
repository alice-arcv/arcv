// frontend/src/components/FigmaSearchInterface.jsx
import React, { useState, useEffect } from 'react';
// Import the search integration service
import { searchSneakers, formatSneakerData } from '../services/searchIntegration';
import '../styles/arcv-figma.css';
// Import the logo with the correct filename
import logoImage from '../images/arcv-logo.png';
// Import the ProductDetail component
import ProductDetail from './ProductDetail';

const FigmaSearchInterface = () => {
  // State for search and results
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchSource, setSearchSource] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    age: '',
    color: '',
    brand: '',
    material: [],
    price: { min: null, max: null }
  });
  
  // State for product detail view
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  // Handle search when Enter key is pressed
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle search button click with enhanced debugging
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
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
      
      // Set the results and remember the source for debugging
      setResults(searchResults.results || []);
      setSearchSource(searchResults.source || 'unknown');
      
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
      setSearchSource('error');
    } finally {
      setLoading(false);
      console.log('=== SEARCH COMPLETED ===');
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    console.log(`Changing ${filterType} filter to:`, value);
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Toggle material filters
  const handleMaterialChange = (material, isChecked) => {
    console.log(`Toggling material '${material}':`, isChecked);
    setFilters(prev => {
      const currentMaterials = [...prev.material];
      
      if (isChecked) {
        currentMaterials.push(material);
      } else {
        const index = currentMaterials.indexOf(material);
        if (index > -1) {
          currentMaterials.splice(index, 1);
        }
      }
      
      return {
        ...prev,
        material: currentMaterials
      };
    });
  };

  // Handle product selection for detail view
  const handleProductSelect = (product) => {
    console.log('Selected product:', product);
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  // Handle filter changes
  useEffect(() => {
    if (searchTerm.trim()) {
      console.log('Filters changed, running search again with term:', searchTerm);
      handleSearch();
    }
  }, [filters]);

  // Mock data to match Figma reference
  const mockData = [
    {
      id: 'aj1-1',
      name: 'AIR JORDAN 1',
      subtitle: '[Retro High OG/Palomino]',
      imageUrl: 'https://via.placeholder.com/300x300/eeeeee/333333?text=Jordan+1'
    },
    {
      id: 'aj1-2',
      name: 'AIR JORDAN 1',
      subtitle: '[Retro High OG/Palomino]',
      imageUrl: 'https://via.placeholder.com/300x300/eeeeee/333333?text=Jordan+1'
    },
    {
      id: 'aj1-3',
      name: 'AIR JORDAN 1',
      subtitle: '[Retro High OG/Palomino]',
      imageUrl: 'https://via.placeholder.com/300x300/eeeeee/333333?text=Jordan+1'
    },
    {
      id: 'aj1-4',
      name: 'AIR JORDAN 1',
      subtitle: '[Retro High OG/Palomino]',
      imageUrl: 'https://via.placeholder.com/300x300/eeeeee/333333?text=Jordan+1'
    },
    {
      id: 'aj1-5',
      name: 'AIR JORDAN 1',
      subtitle: '[Retro High OG/Palomino]',
      imageUrl: 'https://via.placeholder.com/300x300/eeeeee/333333?text=Jordan+1'
    },
    {
      id: 'aj1-6',
      name: 'AIR JORDAN 1',
      subtitle: '[Retro High OG/Palomino]',
      imageUrl: 'https://via.placeholder.com/300x300/eeeeee/333333?text=Jordan+1'
    },
    {
      id: 'aj1-7',
      name: 'AIR JORDAN 1',
      subtitle: '[Retro High OG/Palomino]',
      imageUrl: 'https://via.placeholder.com/300x300/eeeeee/333333?text=Jordan+1'
    },
    {
      id: 'aj1-8',
      name: 'AIR JORDAN 1',
      subtitle: '[Retro High OG/Palomino]',
      imageUrl: 'https://via.placeholder.com/300x300/eeeeee/333333?text=Jordan+1'
    }
  ];

  // Use mockData if no search results
  const displayResults = results.length > 0 ? results : mockData;

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
            
            {/* Search input centered */}
            <div className="figma-search">
              <input
                type="text"
                className="figma-search-input"
                placeholder="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            {/* Control buttons on the right */}
            <div className="figma-controls">
              <button className="figma-control-btn">^</button>
              <button className="figma-control-btn">=</button>
              <div className="figma-user-icon"></div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="figma-content">
            {/* Main layout with filters and results */}
            <div className="figma-main">
              {/* Left sidebar with filters - action buttons removed */}
              <div className="figma-sidebar figma-sidebar-box">
                {/* Filter sections - starting directly with the filters */}
                <div className="figma-filter-section">
                  <label className="figma-filter-label">gender</label>
                </div>
                
                <div className="figma-filter-section">
                  <label className="figma-filter-label">age</label>
                </div>
                
                <div className="figma-filter-section">
                  <label className="figma-filter-label">color</label>
                </div>
                
                <div className="figma-filter-section">
                  <label className="figma-filter-label">brand</label>
                </div>
                
                {/* Material filter with checkboxes */}
                <div className="figma-filter-section">
                  <label className="figma-filter-label">material</label>
                  <div className="figma-checkbox-group">
                    <div className="figma-checkbox-item">
                      <input type="checkbox" id="leather" className="figma-checkbox" />
                      <label htmlFor="leather" className="figma-checkbox-label">Leather</label>
                    </div>
                    <div className="figma-checkbox-item">
                      <input type="checkbox" id="bio-leather" className="figma-checkbox" />
                      <label htmlFor="bio-leather" className="figma-checkbox-label">Bio Leather</label>
                    </div>
                    <div className="figma-checkbox-item">
                      <input type="checkbox" id="textile" className="figma-checkbox" />
                      <label htmlFor="textile" className="figma-checkbox-label">Textile</label>
                    </div>
                    <div className="figma-checkbox-item">
                      <input type="checkbox" id="rubber" className="figma-checkbox" />
                      <label htmlFor="rubber" className="figma-checkbox-label">Rubber</label>
                    </div>
                    <div className="figma-checkbox-item">
                      <input type="checkbox" id="nonwoven" className="figma-checkbox" />
                      <label htmlFor="nonwoven" className="figma-checkbox-label">Nonwoven</label>
                    </div>
                    <div className="figma-checkbox-item">
                      <input type="checkbox" id="synthetic" className="figma-checkbox" />
                      <label htmlFor="synthetic" className="figma-checkbox-label">Synthetic</label>
                    </div>
                    <div className="figma-checkbox-item">
                      <input type="checkbox" id="recycled" className="figma-checkbox" />
                      <label htmlFor="recycled" className="figma-checkbox-label">Recycled Content</label>
                    </div>
                  </div>
                </div>
                
                <div className="figma-filter-section">
                  <label className="figma-filter-label">price</label>
                </div>
              </div>
              
              {/* Right side content with results */}
              <div className="figma-results">
                {loading ? (
                  <div className="figma-loading">
                    <div className="figma-spinner"></div>
                    <p>Searching for sneakers...</p>
                  </div>
                ) : (
                  <div className="figma-grid">
                    {displayResults.map((sneaker) => (
                      <div 
                        key={sneaker.id} 
                        className="figma-product-card"
                        onClick={() => handleProductSelect(sneaker)}
                      >
                        <div className="figma-product-image">
                          <img 
                            src={sneaker.imageUrl} 
                            alt={sneaker.name}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x300/eeeeee/333333?text=Product';
                            }}
                          />
                          {/* Tiny indicator of source that doesn't change the UI look */}
                          {sneaker.source && (
                            <div style={{
                              position: 'absolute',
                              bottom: '2px',
                              right: '2px',
                              fontSize: '8px',
                              color: 'rgba(255,255,255,0.5)',
                              background: 'rgba(0,0,0,0.2)',
                              padding: '1px 3px',
                              borderRadius: '2px'
                            }}>
                              {sneaker.source === 'sneakersapi' ? 's' : 
                               sneaker.source === 'firebase' ? 'f' : 
                               sneaker.source === 'google' ? 'g' : 
                               sneaker.source.slice(0,1)}
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
        </div>
      )}
    </>
  );
};

export default FigmaSearchInterface;