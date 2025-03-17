// frontend/src/components/SaveToFolderPopup.jsx
import React, { useState } from 'react';

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
        <span className="figma-folder-icon">+</span>
        <span className="figma-folder-name">New Folder</span>
      </div>
      
      {/* Folder list */}
      {filteredFolders.map(folder => (
        <div 
          key={folder.id} 
          className="figma-folder-item"
          onClick={() => handleSelectFolder(folder.id)}
        >
          <span className="figma-folder-icon">📁</span>
          <span className="figma-folder-name">{folder.name}</span>
        </div>
      ))}
    </div>
  );
};

export default SaveToFolderPopup;