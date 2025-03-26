import React, { useState, useEffect } from 'react';
import '../styles/arcv-figma.css';
import '../styles/folders-page.css';
import '../styles/dropdown-menu.css';
import '../styles/figma-override.css'; // This should be imported last

// Import the logo image to match FigmaSearchInterface
import logoImage from '../images/arcv-logo.png';

const FoldersPage = ({ onBack }) => {
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
    <div className="figma-container">
      {/* Header with logo and search - Updated to match FigmaSearchInterface */}
      <div className="figma-header">
        {/* Logo that acts as a back button */}
        <div className="figma-logo" onClick={handleBackClick} style={{ cursor: 'pointer' }}>
          <img src={logoImage} alt="ARCV Logo" className="figma-logo-image" />
        </div>
        
        {/* Search input centered with filter toggle and sort button inside */}
        <div className="figma-search">
          <input
            type="text"
            className="figma-search-input"
            placeholder="search folders, tags, content..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          
          {/* Sort dropdown button inside search input */}
          <div className="search-icons">
            {/* Sort dropdown button */}
            <div className="sort-icon" onClick={() => setSortMenuOpen(!sortMenuOpen)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 14l5 5 5-5M7 10l5-5 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              {/* Sort dropdown menu */}
              {sortMenuOpen && (
                <div className="sort-dropdown">
                  <div className={`sort-option ${sortOption === 'newest' ? 'active' : ''}`} 
                       onClick={() => handleSortChange('newest')}>
                    Newest First
                  </div>
                  <div className={`sort-option ${sortOption === 'oldest' ? 'active' : ''}`} 
                       onClick={() => handleSortChange('oldest')}>
                    Oldest First
                  </div>
                  <div className={`sort-option ${sortOption === 'alpha-asc' ? 'active' : ''}`} 
                       onClick={() => handleSortChange('alpha-asc')}>
                    A-Z
                  </div>
                  <div className={`sort-option ${sortOption === 'alpha-desc' ? 'active' : ''}`} 
                       onClick={() => handleSortChange('alpha-desc')}>
                    Z-A
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Control buttons on the right */}
        <div className="figma-controls">
          <button className="figma-control-btn">^</button>
          <button className="figma-control-btn">=</button>
          <div className="figma-user-icon"></div>
        </div>
      </div>
      
      {/* Back to Search Link */}
      <div className="back-to-search">
        <button onClick={handleBackClick} className="back-button">
          ← Back to Search
        </button>
        
        {/* Show active tag filter if any */}
        {activeTag && (
          <div className="active-tag-filter">
            Filtering by: <span className="active-tag">#{activeTag}</span>
            <button 
              className="clear-tag-filter" 
              onClick={() => setActiveTag(null)}
            >
              ×
            </button>
          </div>
        )}
      </div>
      
      {/* Folders grid */}
      {loading ? (
        <div className="loading">Loading folders...</div>
      ) : filteredFolders.length === 0 ? (
        <div className="no-results">No folders match your search</div>
      ) : (
        <div className="figma-content">
          <div className="figma-folders-grid">
            {filteredFolders.map((folder) => (
              <div 
                key={folder.id} 
                className="figma-folder-card-container"
                onClick={() => handleFolderClick(folder.id)}
              >
                {/* New folder card design with tab shape */}
                <div className="folder-card-outer">
                  {/* Tab part of the folder */}
                  <div className="folder-tab">
                    <div className="folder-title">
                      {folder.name}
                    </div>
                    
                    {/* Three dots menu in tab */}
                    <button
                      className="folder-menu-button"
                      onClick={(e) => toggleMenu(folder.id, e)}
                    >
                      <span className="dots">•••</span>
                    </button>
                    
                    {activeMenu === folder.id && (
                      <div className="folder-dropdown-menu">
                        <button>
                          <span className="menu-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" fill="#333"/>
                            </svg>
                          </span> Edit Information
                        </button>
                        <button>
                          <span className="menu-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="#333"/>
                            </svg>
                          </span> Duplicate
                        </button>
                        <button onClick={(e) => handleDeleteClick(folder.id, e)}>
                          <span className="menu-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#333"/>
                            </svg>
                          </span> Delete
                        </button>
                        <button>
                          <span className="menu-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2 .01 7z" fill="#333"/>
                            </svg>
                          </span> Send
                        </button>
                        <button>
                          <span className="menu-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" fill="#333"/>
                            </svg>
                          </span> Download
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Main folder body with image */}
                  <div className="folder-body" style={{ width: '700px', height: '400px' }}>
                    <div className="folder-image-container">
                      <img 
                        src={folder.imageUrl} 
                        alt={folder.name} 
                        className="folder-image"
                      />
                    </div>
                    
                    {/* Folder name and tags at bottom */}
                    <div className="folder-label-area">
                      <div className="folder-name-tag">
                        :{folder.name}
                      </div>
                      <div className="folder-hashtags">
                        {folder.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className={`folder-hashtag ${activeTag === tag ? 'active' : ''}`}
                            onClick={(e) => handleTagClick(tag, e)}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* New Archive Card - Styled to match the Figma reference */}
            <div className="figma-folder-card-container" onClick={handleNewFolderClick}>
              <div className="folder-card-outer new-archive">
                <div className="folder-tab new-archive-tab">
                  <div className="folder-title">new archive</div>
                </div>
                <div className="folder-body new-archive-body">
                  <div className="new-archive-content">
                    <div>+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <p>Are you sure you want to delete this folder?</p>
            <div className="confirm-dialog-buttons">
              <button onClick={cancelDelete}>Cancel</button>
              <button onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
      
      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="modal-overlay" onClick={() => setShowNewFolderModal(false)}>
          <div className="new-folder-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Folder</h2>
            
            <div className="modal-form">
              <div className="form-group">
                <label>Folder Name</label>
                <input 
                  type="text" 
                  value={newFolderData.title}
                  onChange={(e) => setNewFolderData({...newFolderData, title: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Tags</label>
                <div className="tags-editor">
                  {newFolderData.tags.map((tag, index) => (
                    <div key={index} className="tag-edit-item">
                      <input 
                        type="text"
                        value={tag}
                        onChange={(e) => handleNewFolderTagChange(index, e.target.value)}
                      />
                      <button 
                        className="remove-tag-btn"
                        onClick={() => handleRemoveNewFolderTag(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  className="modal-btn"
                  onClick={handleAddNewFolderTag}
                >
                  Add Tag
                </button>
              </div>
              
              <div className="form-group">
                <label>Images</label>
                <div className="images-preview">
                  {newFolderData.images.map((img, index) => (
                    <div key={index} className="preview-image">
                      <img src={img} alt={`Preview ${index}`} />
                    </div>
                  ))}
                  
                  <div className="add-image-btn" onClick={handleAddImage}>
                    <span>+</span>
                    <p>Add Image</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowNewFolderModal(false)}
              >
                Cancel
              </button>
              <button 
                className="create-btn"
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

export default FoldersPage;