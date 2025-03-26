import React, { useState, useEffect } from 'react';
// Only import our new CSS file
import '../styles/simple-folders.css';

// Import the logo image
import logoImage from '../images/arcv-logo.png';

const SimpleFoldersPage = ({ onBack }) => {
  const [folders, setFolders] = useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [activeTag, setActiveTag] = useState(null);
  
  // New folder modal state
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderData, setNewFolderData] = useState({
    title: "New Folder",
    tags: ["new", "folder"],
    images: []
  });

  useEffect(() => {
    // Mock data for folders
    const mockFolders = [
      {
        id: 1,
        name: "running shoes",
        tags: ["running", "sneakers"],
        imageUrl: "https://via.placeholder.com/300/FF5733/FFFFFF?text=Running+Shoes"
      },
      {
        id: 2,
        name: "nike air max",
        tags: ["nike", "airmax", "sneakers"],
        imageUrl: "https://via.placeholder.com/300/33A8FF/FFFFFF?text=Nike+Air+Max"
      },
      {
        id: 3,
        name: "adidas collection",
        tags: ["adidas", "sneakers"],
        imageUrl: "https://via.placeholder.com/300/33FF57/FFFFFF?text=Adidas+Collection"
      },
      {
        id: 4,
        name: "nike",
        tags: ["nike", "sneakers"],
        imageUrl: "https://via.placeholder.com/300/FF9933/FFFFFF?text=Nike"
      },
      {
        id: 5,
        name: "new folder",
        tags: ["new", "folder"],
        imageUrl: "https://via.placeholder.com/300/9933FF/FFFFFF?text=New+Folder"
      },
      {
        id: 6,
        name: "adidas",
        tags: ["adidas", "sneakers", "black"],
        imageUrl: "https://via.placeholder.com/300/FF3399/FFFFFF?text=adidas"
      },
      {
        id: 7,
        name: "activewear",
        tags: ["alo", "athleisure", "black"],
        imageUrl: "https://via.placeholder.com/300/333333/FFFFFF?text=Activewear"
      }
    ];
    
    setFolders(mockFolders);
    setFilteredFolders(mockFolders);
    setLoading(false);
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // If no search term, but there's an active tag, filter by that tag
      if (activeTag) {
        const filtered = folders.filter(folder => 
          folder.tags.includes(activeTag)
        );
        setFilteredFolders(filtered);
      } else {
        // No search term and no active tag, show all folders
        setFilteredFolders(folders);
      }
    } else {
      // Filter folders based on search term
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      const filtered = folders.filter(folder => {
        // Check if search term is in folder name
        const nameMatch = folder.name.toLowerCase().includes(normalizedSearchTerm);
        
        // Check if search term is in any tag
        const tagMatch = folder.tags.some(tag => 
          tag.toLowerCase().includes(normalizedSearchTerm)
        );
        
        return nameMatch || tagMatch;
      });
      
      // If there's an active tag, further filter by that tag
      if (activeTag) {
        const tagFiltered = filtered.filter(folder => 
          folder.tags.includes(activeTag)
        );
        setFilteredFolders(tagFiltered);
      } else {
        setFilteredFolders(filtered);
      }
    }
  }, [searchTerm, folders, activeTag]);

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
  };

  const toggleMenu = (folderId, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === folderId ? null : folderId);
  };

  const handleFolderClick = (folderId) => {
    console.log(`Viewing folder ${folderId}`);
    // Navigate to folder detail view
  };

  const handleDeleteClick = (folderId, e) => {
    e.stopPropagation();
    setFolderToDelete(folderId);
    setShowConfirmDialog(true);
    setActiveMenu(null);
  };

  const confirmDelete = () => {
    const updatedFolders = folders.filter(folder => folder.id !== folderToDelete);
    setFolders(updatedFolders);
    setFilteredFolders(updatedFolders);
    setShowConfirmDialog(false);
    setFolderToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setFolderToDelete(null);
  };
  
  // Handle hashtag click
  const handleTagClick = (tag, e) => {
    e.stopPropagation(); // Prevent folder click
    
    if (activeTag === tag) {
      // If clicking the already active tag, deselect it
      setActiveTag(null);
    } else {
      // Otherwise, set as the active tag
      setActiveTag(tag);
    }
  };
  
  // Handle new folder button click
  const handleNewFolderClick = () => {
    setShowNewFolderModal(true);
  };
  
  // Handle new folder tag input
  const handleNewFolderTagChange = (index, value) => {
    const updatedTags = [...newFolderData.tags];
    // Remove # if it exists when storing in the array
    updatedTags[index] = value.startsWith('#') ? value.substring(1) : value;
    setNewFolderData({ ...newFolderData, tags: updatedTags });
  };
  
  // Add tag to new folder
  const handleAddNewFolderTag = () => {
    setNewFolderData({
      ...newFolderData,
      tags: [...newFolderData.tags, "new"]
    });
  };
  
  // Remove tag from new folder
  const handleRemoveNewFolderTag = (index) => {
    const updatedTags = newFolderData.tags.filter((_, i) => i !== index);
    setNewFolderData({ ...newFolderData, tags: updatedTags });
  };
  
  // Handle adding image to new folder
  const handleAddImage = () => {
    // Generate a random hex color for the placeholder
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    const placeholderUrl = `https://via.placeholder.com/300/${randomColor}/FFFFFF?text=New+Image`;
    
    setNewFolderData({
      ...newFolderData,
      images: [...newFolderData.images, placeholderUrl]
    });
  };
  
  // Create the new folder
  const handleCreateFolder = () => {
    // Create a new folder with the entered data
    const newFolder = {
      id: Date.now(), // use timestamp as a simple unique ID
      name: newFolderData.title.toLowerCase(), // Store name in lowercase to match design
      tags: newFolderData.tags,
      imageUrl: newFolderData.images.length ? newFolderData.images[0] : 
        "https://via.placeholder.com/300/eeeeee/333333?text=New+Folder"
    };
    
    // Add the new folder to state
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    setFilteredFolders(updatedFolders);
    
    // Close the modal and reset the form
    setShowNewFolderModal(false);
    setNewFolderData({
      title: "New Folder",
      tags: ["new", "folder"],
      images: []
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort selection
  const handleSortChange = (option) => {
    setSortOption(option);
    setSortMenuOpen(false);
    
    // Apply sorting to folders
    let sortedFolders = [...filteredFolders];
    
    switch(option) {
      case 'newest':
        sortedFolders.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        sortedFolders.sort((a, b) => a.id - b.id);
        break;
      case 'alpha-asc':
        sortedFolders.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alpha-desc':
        sortedFolders.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (newest)
        sortedFolders.sort((a, b) => b.id - a.id);
    }
    
    setFilteredFolders(sortedFolders);
  };

  return (
    <div className="simple-folders-page">
      {/* Header with logo and search */}
      <div className="simple-header">
        {/* Logo that acts as a back button */}
        <div className="simple-logo" onClick={handleBackClick}>
          <img src={logoImage} alt="ARCV Logo" />
        </div>
        
        {/* Search input */}
        <div className="simple-search">
          <input
            type="text"
            className="simple-search-input"
            placeholder="search folders, tags, content..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          
          {/* Sort dropdown button */}
          <div className="simple-sort-icon" onClick={() => setSortMenuOpen(!sortMenuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 14l5 5 5-5M7 10l5-5 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            
            {/* Sort dropdown menu */}
            {sortMenuOpen && (
              <div className="simple-sort-dropdown">
                <div 
                  className={`simple-sort-option ${sortOption === 'newest' ? 'active' : ''}`} 
                  onClick={() => handleSortChange('newest')}
                >
                  Newest First
                </div>
                <div 
                  className={`simple-sort-option ${sortOption === 'oldest' ? 'active' : ''}`} 
                  onClick={() => handleSortChange('oldest')}
                >
                  Oldest First
                </div>
                <div 
                  className={`simple-sort-option ${sortOption === 'alpha-asc' ? 'active' : ''}`} 
                  onClick={() => handleSortChange('alpha-asc')}
                >
                  A-Z
                </div>
                <div 
                  className={`simple-sort-option ${sortOption === 'alpha-desc' ? 'active' : ''}`} 
                  onClick={() => handleSortChange('alpha-desc')}
                >
                  Z-A
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="simple-controls">
          <button className="simple-control-btn">^</button>
          <button className="simple-control-btn">=</button>
          <div className="simple-user-icon"></div>
        </div>
      </div>
      
      {/* Back to Search Link */}
      <div className="simple-back">
        <button onClick={handleBackClick} className="simple-back-button">
          ← Back to Search
        </button>
        
        {/* Show active tag filter if any */}
        {activeTag && (
          <div className="simple-tag-filter">
            Filtering by: <span className="simple-active-tag">#{activeTag}</span>
            <button 
              className="simple-clear-filter" 
              onClick={() => setActiveTag(null)}
            >
              ×
            </button>
          </div>
        )}
      </div>
      
      {/* Folders grid */}
      {loading ? (
        <div className="simple-loading">Loading folders...</div>
      ) : filteredFolders.length === 0 ? (
        <div className="simple-no-results">No folders match your search</div>
      ) : (
        <div className="simple-folders-grid">
          {filteredFolders.map((folder) => (
            <div 
              key={folder.id} 
              className="simple-folder-item"
              onClick={() => handleFolderClick(folder.id)}
            >
              {/* Folder box with image */}
              <div className="simple-folder-box">
                {/* Menu button in top left */}
                <div className="simple-menu-dots" onClick={(e) => toggleMenu(folder.id, e)}>
                  •••
                  
                  {/* Dropdown menu */}
                  {activeMenu === folder.id && (
                    <div className="simple-dropdown">
                      <button>Edit Information</button>
                      <button>Duplicate</button>
                      <button onClick={(e) => handleDeleteClick(folder.id, e)}>Delete</button>
                      <button>Send</button>
                      <button>Download</button>
                    </div>
                  )}
                </div>
                
                {/* Folder image */}
                <img 
                  src={folder.imageUrl} 
                  alt={folder.name} 
                  className="simple-folder-image"
                />
              </div>
              
              {/* Title and tags below folder */}
              <div className="simple-folder-info">
                <div className="simple-folder-title">:{folder.name}</div>
                <div className="simple-folder-tags">
                  {folder.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className={`simple-folder-tag ${activeTag === tag ? 'active' : ''}`}
                      onClick={(e) => handleTagClick(tag, e)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          {/* New folder button - simple dashed rectangle */}
          <div className="simple-folder-item" onClick={handleNewFolderClick}>
            <div className="simple-new-folder">
              <div className="simple-plus-icon">+</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="simple-overlay">
          <div className="simple-confirm-dialog">
            <p>Are you sure you want to delete this folder?</p>
            <div className="simple-dialog-buttons">
              <button onClick={cancelDelete}>Cancel</button>
              <button onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
      
      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="simple-overlay" onClick={() => setShowNewFolderModal(false)}>
          <div className="simple-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Folder</h2>
            
            <div className="simple-form">
              <div className="simple-form-group">
                <label>Folder Name</label>
                <input 
                  type="text" 
                  value={newFolderData.title}
                  onChange={(e) => setNewFolderData({...newFolderData, title: e.target.value})}
                />
              </div>
              
              <div className="simple-form-group">
                <label>Tags</label>
                <div className="simple-tags-editor">
                  {newFolderData.tags.map((tag, index) => (
                    <div key={index} className="simple-tag-item">
                      <input 
                        type="text"
                        value={tag}
                        onChange={(e) => handleNewFolderTagChange(index, e.target.value)}
                      />
                      <button 
                        className="simple-remove-btn"
                        onClick={() => handleRemoveNewFolderTag(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  className="simple-btn"
                  onClick={handleAddNewFolderTag}
                >
                  Add Tag
                </button>
              </div>
              
              <div className="simple-form-group">
                <label>Images</label>
                <div className="simple-images-preview">
                  {newFolderData.images.map((img, index) => (
                    <div key={index} className="simple-preview">
                      <img src={img} alt={`Preview ${index}`} />
                    </div>
                  ))}
                  
                  <div className="simple-add-image" onClick={handleAddImage}>
                    <span>+</span>
                    <p>Add Image</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="simple-modal-actions">
              <button 
                className="simple-cancel-btn"
                onClick={() => setShowNewFolderModal(false)}
              >
                Cancel
              </button>
              <button 
                className="simple-create-btn"
                onClick={handleCreateFolder}
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleFoldersPage;