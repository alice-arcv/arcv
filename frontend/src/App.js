// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import FigmaSearchInterface from './components/FigmaSearchInterface';
import SimpleFoldersPage from './components/SimpleFoldersPage';
import ImageSearchPage from './components/ImageSearchPage';
import './styles/arcv-figma.css';

function App() {
  // State for managing page navigation
  const [currentPage, setCurrentPage] = useState('search');
  
  // State for folders and products - initialized with empty values
  const [folders, setFolders] = useState([]);
  const [folderProducts, setFolderProducts] = useState({});
  
  // Dummy functions for folder and product management
  const createFolder = () => {};
  const saveProductToFolder = () => {};
  
  // Navigation functions - unchanged
  const goToFoldersPage = () => {
    setCurrentPage('folders');
  };
  
  const goToSearchPage = () => {
    setCurrentPage('search');
  };
  
  const goToImageSearchPage = () => {
    setCurrentPage('imageSearch');
  };
  
  return (
    <Router>
      <div className="App">
        {currentPage === 'search' ? (
          <FigmaSearchInterface 
            savedFolders={folders}
            savedProducts={folderProducts}
            onCreateFolder={createFolder}
            onSaveProduct={saveProductToFolder}
            onGoToFolders={goToFoldersPage}
            onGoToImageSearch={goToImageSearchPage}
          />
        ) : currentPage === 'folders' ? (
          <SimpleFoldersPage
            savedFolders={folders}
            savedProducts={folderProducts}
            onBack={goToSearchPage}
            onGoToFolders={goToFoldersPage}
          />
        ) : (
          <ImageSearchPage 
            onBack={goToSearchPage}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
