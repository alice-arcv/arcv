import React, { useState, useEffect } from 'react';
import './App.css';
import FigmaSearchInterface from './components/FigmaSearchInterface';
import ProductDetail from './components/ProductDetail';
import SimpleFoldersPage from './components/SimpleFoldersPage';
import FolderContentsPage from './components/FolderContentsPage';
import SaveToFolderPopup from './components/SaveToFolderPopup';
import ImageSearchPage from './components/ImageSearchPage';
import ProfileDropdown from './components/ProfileDropdown';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  // Removed unused setter functions
  const [folders] = useState([]);
  const [folderProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [productToSave, setProductToSave] = useState(null);
  const [currentPage, setCurrentPage] = useState('search');
  const [currentFolder, setCurrentFolder] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profileDropdownPosition, setProfileDropdownPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown') && !event.target.closest('.profile-icon')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleProductClick = (product) => {
    setCurrentProduct(product);
    setShowProductDetail(true);
  };

  const handleBackToSearch = () => {
    setShowProductDetail(false);
    setCurrentProduct(null);
  };

  const handleSaveToFolder = (product) => {
    setProductToSave(product);
    setShowSavePopup(true);
  };

  const handleCloseSavePopup = () => {
    setShowSavePopup(false);
    setProductToSave(null);
  };

  const handleProfileIconClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setProfileDropdownPosition({
      top: rect.bottom + window.scrollY,
      right: window.innerWidth - rect.right - window.scrollX
    });
    setShowProfileDropdown(!showProfileDropdown);
  };

  const navigateTo = (page, folder = null) => {
    setCurrentPage(page);
    if (folder) {
      setCurrentFolder(folder);
    }
    setShowProfileDropdown(false);
  };

  return (
    <div className="App">
      <div className="app-header">
        <div className="logo-container">
          <span className="logo-text">ARCV</span>
        </div>
        <div className="profile-container">
          <div 
            className="profile-icon" 
            onClick={handleProfileIconClick}
          >
            <span>A</span>
          </div>
          {showProfileDropdown && (
            <ProfileDropdown 
              position={profileDropdownPosition} 
              navigateTo={navigateTo}
            />
          )}
        </div>
      </div>

      <div className="app-content">
        {currentPage === 'search' && !showProductDetail && (
          <FigmaSearchInterface 
            onProductClick={handleProductClick} 
            onSaveToFolder={handleSaveToFolder}
          />
        )}

        {currentPage === 'image-search' && !showProductDetail && (
          <ImageSearchPage 
            onProductClick={handleProductClick} 
            onSaveToFolder={handleSaveToFolder}
          />
        )}

        {currentPage === 'folders' && (
          <SimpleFoldersPage 
            onFolderClick={(folder) => navigateTo('folder-contents', folder)}
          />
        )}

        {currentPage === 'folder-contents' && currentFolder && (
          <FolderContentsPage 
            folder={currentFolder}
            onProductClick={handleProductClick}
            onBackClick={() => navigateTo('folders')}
          />
        )}

        {showProductDetail && (
          <ProductDetail 
            product={currentProduct} 
            onBack={handleBackToSearch}
            onSaveToFolder={() => handleSaveToFolder(currentProduct)}
          />
        )}

        {showSavePopup && (
          <SaveToFolderPopup 
            product={productToSave}
            onClose={handleCloseSavePopup}
          />
        )}
      </div>
    </div>
  );
}

export default App;
