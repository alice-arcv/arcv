// frontend/src/components/ImageSearchPage.jsx
import React, { useState, useEffect } from 'react';
import '../styles/arcv-figma.css';
// Import the logo with the correct filename
import logoImage from '../images/arcv-logo.png';

const ImageSearchPage = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('/dna');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [resultsCount, setResultsCount] = useState(0);
  
  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setUploadedImage(imageDataUrl);
        analyzeImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setUploadedImage(imageDataUrl);
        analyzeImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  
  // Simulate image analysis
  const analyzeImage = (imageUrl) => {
    setIsAnalyzing(true);
    setSimilarProducts([]);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock similar products data - matching Figma example
      const mockResults = [
        {
          id: 'nike-1',
          name: 'NIKE',
          subtitle: '[Alphafly 3/]',
          matchPercentage: '80%',
          imageUrl: 'https://via.placeholder.com/300x200/eeeeee/333333?text=Nike+Green'
        },
        {
          id: 'nike-2',
          name: 'NIKE',
          subtitle: '[Alphafly 3/]',
          matchPercentage: '80%',
          imageUrl: 'https://via.placeholder.com/300x200/eeeeee/333333?text=Nike+White'
        },
        {
          id: 'nike-3',
          name: 'NIKE',
          subtitle: '[Alphafly 3/]',
          matchPercentage: '80%',
          imageUrl: 'https://via.placeholder.com/300x200/eeeeee/333333?text=On+Running'
        },
        {
          id: 'nike-4',
          name: 'NIKE',
          subtitle: '[Alphafly 3/]',
          matchPercentage: '80%',
          imageUrl: 'https://via.placeholder.com/300x200/eeeeee/333333?text=Nike+Next'
        }
      ];
      
      // Save recent searches
      if (imageUrl && !recentSearches.some(item => item.imageUrl === imageUrl)) {
        const newSearchItem = {
          id: Date.now(),
          imageUrl: imageUrl
        };
        setRecentSearches(prev => [newSearchItem, ...prev.slice(0, 4)]);
      }
      
      // Update state with mock data
      setSimilarProducts(mockResults);
      setResultsCount(17); // Matching the Figma reference showing "RESULTS: 17"
      setIsAnalyzing(false);
    }, 2000);
  };
  
  // Handle clicking on upload area
  const triggerFileInput = () => {
    document.getElementById('dna-file-input').click();
  };
  
  // Handle camera capture option
  const handleCameraCapture = () => {
    // In a real app, this would open the camera
    alert('Camera functionality would open here');
  };
  
  return (
    <div className="figma-container">
      {/* Header with logo and search */}
      <div className="figma-header">
        {/* Back button */}
        <div className="figma-logo">
          <button onClick={onBack} className="figma-back-button">← Back</button>
        </div>
        
        {/* Search input centered */}
        <div className="figma-search">
          <input
            type="text"
            className="figma-search-input"
            placeholder="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            readOnly
          />
        </div>
        
        {/* Control buttons on the right */}
        <div className="figma-controls">
          <button className="figma-control-btn">^</button>
          <button className="figma-control-btn">=</button>
          <div className="figma-user-icon"></div>
        </div>
      </div>
      
      {/* Main content area with grid background */}
      <div className="figma-dna-content">
        {/* Results count - only show when results are available */}
        {(similarProducts.length > 0 || isAnalyzing) && (
          <div className="figma-dna-results-count">
            RESULTS: {resultsCount}
          </div>
        )}
        
        {/* Two-panel layout */}
        <div className="figma-dna-panels">
          {/* Left panel - results or loading */}
          <div className="figma-dna-left-panel">
            {isAnalyzing ? (
              <div className="figma-dna-loading-container">
                <div className="figma-dna-loading-bar">
                  <div className="figma-dna-loading-progress"></div>
                </div>
                <div className="figma-dna-loading-text">LOADING</div>
              </div>
            ) : similarProducts.length > 0 ? (
              <div className="figma-dna-results-list">
                {similarProducts.map((product, index) => (
                  <div key={product.id} className="figma-dna-result-item">
                    <div className="figma-dna-result-image">
                      <img src={product.imageUrl} alt={product.name} />
                    </div>
                    <div className="figma-dna-result-details">
                      <div className="figma-dna-result-name">{product.name}</div>
                      <div className="figma-dna-result-subtitle">{product.subtitle}</div>
                      <div className="figma-dna-result-match">Match: {product.matchPercentage}</div>
                    </div>
                    <div className="figma-dna-result-action">
                      <button className="figma-dna-expand-btn">⎋</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="figma-dna-empty-state">
                <div className="figma-dna-empty-message">
                  Upload an image to see matches
                </div>
              </div>
            )}
          </div>
          
          {/* Right panel - uploaded image or upload area */}
          <div className="figma-dna-right-panel">
            {uploadedImage ? (
              <>
                <div className="figma-dna-image-display">
                  <img src={uploadedImage} alt="Reference" />
                </div>
                
                {/* Thumbnails at bottom */}
                {recentSearches.length > 0 && (
                  <div className="figma-dna-thumbnails">
                    {recentSearches.map(item => (
                      <div 
                        key={item.id} 
                        className="figma-dna-thumbnail"
                        onClick={() => {
                          setUploadedImage(item.imageUrl);
                          analyzeImage(item.imageUrl);
                        }}
                      >
                        <img src={item.imageUrl} alt="Recent search" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="figma-dna-upload-container">
                {/* Main upload area */}
                <div 
                  className="figma-dna-upload-sketch"
                  onClick={triggerFileInput}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="figma-dna-upload-icon">⇧</div>
                  <div className="figma-dna-upload-text">UPLOAD SKETCH</div>
                  <input
                    id="dna-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </div>
                
                {/* Camera option */}
                <div 
                  className="figma-dna-camera-option"
                  onClick={handleCameraCapture}
                >
                  <div className="figma-dna-camera-icon">📷</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSearchPage;