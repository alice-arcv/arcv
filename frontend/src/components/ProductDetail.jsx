// frontend/src/components/ProductDetail.jsx
import React, { useState } from 'react';
import '../styles/arcv-figma.css';

const ProductDetail = ({ product, onBack }) => {
  const [mainImage, setMainImage] = useState(product?.imageUrl || '');
  const [activeTab, setActiveTab] = useState('similar');
  
  // Generate mock additional images
  const additionalImages = [
    product?.imageUrl || 'https://via.placeholder.com/300x300/eeeeee/333333?text=Side',
    'https://via.placeholder.com/300x300/eeeeee/333333?text=Back',
    'https://via.placeholder.com/300x300/eeeeee/333333?text=Detail'
  ];

  // Mock similar and brand products
  const similarProducts = Array(5).fill(null).map((_, i) => ({
    id: `similar-${i}`,
    name: 'AIR JORDAN 1',
    subtitle: ['[Dark Mocha]', '[Chicago]', '[University Blue]', '[Shadow]', '[Royal]'][i % 5],
    imageUrl: `https://via.placeholder.com/300x300/eeeeee/333333?text=Similar+${i+1}`
  }));
  
  const brandProducts = Array(5).fill(null).map((_, i) => ({
    id: `brand-${i}`,
    name: [`AIR JORDAN ${i+2}`, 'AIR JORDAN 11', 'TRAVIS SCOTT', 'AIR JORDAN 4', 'AIR JORDAN 6'][i % 5],
    subtitle: ['[Fire Red]', '[Concord]', '[Mocha]', '[Bred]', '[Infrared]'][i % 5],
    imageUrl: `https://via.placeholder.com/300x300/eeeeee/333333?text=Brand+${i+1}`
  }));

  return (
    <div className="figma-container">
      {/* Header with back button */}
      <div className="figma-header">
        <div className="figma-logo">
          <button onClick={onBack} className="figma-back-button">← Back</button>
        </div>
        
        <div className="figma-search">
          <input
            type="text"
            className="figma-search-input"
            placeholder="search"
            defaultValue={product?.name || 'brown Air Jordans'}
            readOnly
          />
        </div>
        
        <div className="figma-controls">
          <button className="figma-control-btn">^</button>
          <button className="figma-control-btn">=</button>
          <div className="figma-user-icon"></div>
        </div>
      </div>
      
      {/* Main product detail layout */}
      <div className="figma-content">
        <div className="figma-detail-container">
          {/* Left side - collapsible sections */}
          <div className="figma-detail-sidebar">
            {/* Context section */}
            <div className="figma-detail-section">
              <div className="figma-detail-section-header">
                <button className="figma-section-toggle">+</button>
                <h3>context</h3>
              </div>
              <div className="figma-detail-section-content">
                <p>
                  Released in October 2020, the high-top 'Dark Mocha' features a Sail leather
                  base with black leather overlays and Mocha suede on the heel and ankle. This
                  design draws inspiration from previous collaborations and has become a
                  sought-after model among sneaker enthusiasts.
                </p>
              </div>
            </div>
            
            {/* Specifications section */}
            <div className="figma-detail-section">
              <div className="figma-detail-section-header">
                <button className="figma-section-toggle">+</button>
                <h3>specifications</h3>
              </div>
              <div className="figma-detail-section-content">
                <div className="figma-spec-grid">
                  <div className="figma-spec-row">
                    <span className="figma-spec-label">Brand:</span>
                    <span className="figma-spec-value">{product?.brand || 'Air Jordan'}</span>
                  </div>
                  <div className="figma-spec-row">
                    <span className="figma-spec-label">Model:</span>
                    <span className="figma-spec-value">1 Retro High OG</span>
                  </div>
                  <div className="figma-spec-row">
                    <span className="figma-spec-label">Colorway:</span>
                    <span className="figma-spec-value">{product?.colorway || 'Dark Mocha'}</span>
                  </div>
                  <div className="figma-spec-row">
                    <span className="figma-spec-label">Release Date:</span>
                    <span className="figma-spec-value">October 31, 2020</span>
                  </div>
                  <div className="figma-spec-row">
                    <span className="figma-spec-label">Style Code:</span>
                    <span className="figma-spec-value">555088-105</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tags section */}
            <div className="figma-detail-section">
              <div className="figma-detail-section-header">
                <button className="figma-section-toggle">+</button>
                <h3>tags</h3>
              </div>
              <div className="figma-detail-section-content">
                <div className="figma-tags-container">
                  {(product?.tags || ['basketball', 'retro', 'leather', 'high-top', 'brown', 'black', 'white']).map((tag, i) => (
                    <span key={i} className="figma-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sources section */}
            <div className="figma-detail-section">
              <div className="figma-detail-section-header">
                <button className="figma-section-toggle">+</button>
                <h3>sources</h3>
              </div>
              <div className="figma-detail-section-content">
                <ul className="figma-sources-list">
                  <li><a href="#" className="figma-source-link">Nike</a></li>
                  <li><a href="#" className="figma-source-link">StockX</a></li>
                  <li><a href="#" className="figma-source-link">GOAT</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Right side - image gallery */}
          <div className="figma-detail-gallery">
            {/* Main large image */}
            <div className="figma-main-image">
              <img src={mainImage || product?.imageUrl} alt={product?.name} />
            </div>
            
            {/* Thumbnail row */}
            <div className="figma-thumbnails">
              {additionalImages.map((img, i) => (
                <div 
                  key={i} 
                  className={`figma-thumbnail ${mainImage === img ? 'active' : ''}`}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt={`View ${i+1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tabbed section for similar/brand products */}
        <div className="figma-related-container">
          <div className="figma-tabs">
            <button 
              className={`figma-tab ${activeTab === 'similar' ? 'active' : ''}`}
              onClick={() => setActiveTab('similar')}
            >
              similar
            </button>
            <button 
              className={`figma-tab ${activeTab === 'brand' ? 'active' : ''}`}
              onClick={() => setActiveTab('brand')}
            >
              more from the brand
            </button>
          </div>
          
          <div className="figma-related-products">
            {(activeTab === 'similar' ? similarProducts : brandProducts).map(product => (
              <div key={product.id} className="figma-product-card">
                <div className="figma-product-image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="figma-product-info">
                  <h3 className="figma-product-title">{product.name}</h3>
                  <div className="figma-product-subtitle">{product.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;