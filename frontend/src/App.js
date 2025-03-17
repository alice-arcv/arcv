// frontend/src/App.js
import React, { useState } from 'react';
import FigmaSearchInterface from './components/FigmaSearchInterface';
import FoldersPage from './components/FoldersPage';
import ImageSearchPage from './components/ImageSearchPage';
import ApiTester from './components/ApiTester'; // Import the tester
import './styles/arcv-figma.css';

function App() {
  // State for managing page navigation
  const [currentPage, setCurrentPage] = useState('search');
  
  // State for saving folders and products
  const [savedFolders, setSavedFolders] = useState([
    { id: 1, name: 'activewear sportsbra black' },
    { id: 2, name: 'red jordans nike sneakers' },
    { id: 3, name: 'denim luxury distressed' },
    { id: 4, name: 'running sneakers' },
    { id: 5, name: 'zebraprint luxury' },
    { id: 6, name: 'suitcase aluminum luxury' },
    { id: 7, name: 'samba lookalike red' },
    { id: 8, name: 'tinted sunglasses oversize' }
  ]);
  
  const [savedProducts, setSavedProducts] = useState({
    1: ['product-1', 'product-2', 'product-3'],
    2: ['product-4', 'product-5'],
    3: ['product-6', 'product-7'],
    4: ['product-8'],
    5: ['product-9', 'product-10', 'product-11'],
    6: ['product-12', 'product-13'],
    7: ['product-14', 'product-15'],
    8: ['product-16', 'product-17']
  });
  
  // Function to create a new folder
  const createFolder = (name) => {
    const newFolder = {
      id: savedFolders.length + 1,
      name: name
    };
    setSavedFolders([...savedFolders, newFolder]);
    return newFolder.id;
  };
  
  // Function to save product to folder
  const saveProductToFolder = (productId, folderId) => {
    setSavedProducts(prev => {
      const updated = {...prev};
      if (!updated[folderId]) {
        updated[folderId] = [];
      }
      
      // Only add if not already in the folder
      if (!updated[folderId].includes(productId)) {
        updated[folderId] = [...updated[folderId], productId];
      }
      
      return updated;
    });
  };
  
  // Navigation functions
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
    <div className="App">
      {currentPage === 'search' ? (
        <FigmaSearchInterface 
          savedFolders={savedFolders}
          savedProducts={savedProducts}
          onCreateFolder={createFolder}
          onSaveProduct={saveProductToFolder}
          onGoToFolders={goToFoldersPage}
          onGoToImageSearch={goToImageSearchPage}
        />
      ) : currentPage === 'folders' ? (
        <FoldersPage 
          savedFolders={savedFolders}
          savedProducts={savedProducts}
          onBack={goToSearchPage}
        />
      ) : (
        <ImageSearchPage 
          onBack={goToSearchPage}
        />
      )}
      <ApiTester /> {/* Keep the tester if needed */}
    </div>
  );
}

export default App;