// frontend/src/components/SaveToFolderPopup.jsx
import React, { useState } from 'react';
// Import the folder icon from the src/images directory
import folderPlusIcon from '../images/folder-plus-icon.png';

const SaveToFolderPopup = ({ folders, onClose, onSave, onCreateFolder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter folders based on search term
  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Create a new folder
  const handleCreateFolder = () => {
    const newFolderName = prompt('Enter folder name:');
    if (newFolderName && newFolderName.trim()) {
      const newFolderId = onCreateFolder(newFolderName.trim());
      if (newFolderId) {
        onSave(newFolderId);
      }
    }
  };
  
  // Save to a folder
  const handleSelectFolder = (folderId) => {
    onSave(folderId);
    onClose();
  };
  
  return (
    <div className="figma-folder-popup">
      {/* Search input */}
      <div className="figma-folder-search">
        <input
          type="text"
          placeholder="Find a folder"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* New folder option */}
      <div 
        className="figma-folder-item figma-new-folder"
        onClick={handleCreateFolder}
      >
        {/* Using the imported folder icon */}
        <img 
          src={folderPlusIcon} 
          alt="New Folder" 
          className="figma-folder-icon"
          style={{ width: '20px', height: '20px' }}
        />
        <span className="figma-folder-name">New Folder</span>
      </div>
      
      {/* Folder list - with scrolling */}
      <div className="folder-list">
        {filteredFolders.map(folder => (
          <div 
            key={folder.id} 
            className="figma-folder-item"
            onClick={() => handleSelectFolder(folder.id)}
          >
            {/* Using the imported folder icon */}
            <img 
              src={folderPlusIcon} 
              alt="Folder" 
              className="figma-folder-icon"
              style={{ width: '20px', height: '20px' }}
            />
            <span className="figma-folder-name">{folder.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaveToFolderPopup;