// frontend/src/components/FoldersPage.jsx
import React, { useState, useEffect } from 'react';
import '../styles/arcv-figma.css';
// Import the logo with the correct filename
import logoImage from '../images/arcv-logo.png';

const FoldersPage = ({ onBack, savedFolders, savedProducts }) => {
  const [searchTerm, setSearchTerm] = useState('/myarchive');
  
  // Generate folder preview images
  const getFolderPreviews = (folderId) => {
    const productIds = savedProducts[folderId] || [];
    // Return placeholder images for demo
    return [
      `https://via.placeholder.com/300x300/eeeeee/333333?text=Item+1`,
      `https://via.placeholder.com/300x300/eeeeee/333333?text=Item+2`,
      `https://via.placeholder.com/300x300/eeeeee/333333?text=Item+3`
    ];
  };
  
  // Generate folder tags
  const getFolderTags = (folderName) => {
    // Convert folder name to tags
    const words = folderName.toLowerCase().split(' ');
    return words.map(word => `#${word}`);
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
      
      {/* Main content area with folders */}
      <div className="figma-content">
        <div className="figma-folders-grid">
          {savedFolders.map((folder) => (
            <div key={folder.id} className="figma-folder-card">
              <div className="figma-folder-preview">
                {/* Main preview image */}
                <div className="figma-folder-main-preview">
                  <img 
                    src={getFolderPreviews(folder.id)[0]}
                    alt={`${folder.name} preview`}
                  />
                </div>
                
                {/* Smaller preview images */}
                <div className="figma-folder-small-previews">
                  <div className="figma-folder-small-preview">
                    <img 
                      src={getFolderPreviews(folder.id)[1]}
                      alt={`${folder.name} preview`}
                    />
                  </div>
                  <div className="figma-folder-small-preview">
                    <img 
                      src={getFolderPreviews(folder.id)[2]}
                      alt={`${folder.name} preview`}
                    />
                  </div>
                </div>
              </div>
              
              {/* Folder action buttons (visible on hover) */}
              <div className="figma-folder-actions">
                <button className="figma-folder-action-btn">
                  <span className="figma-action-icon">+</span>
                </button>
                <button className="figma-folder-action-btn">
                  <span className="figma-action-icon">↓</span>
                </button>
                <button className="figma-folder-action-btn">
                  <span className="figma-action-icon">↗</span>
                </button>
              </div>
              
              {/* Folder tags */}
              <div className="figma-folder-tags">
                {getFolderTags(folder.name).map((tag, index) => (
                  <span key={index} className="figma-folder-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoldersPage;