import React, { useState, useEffect, useRef } from 'react';
// Import our CSS files
import '../styles/simple-folders.css';
import '../styles/folder-contents.css';

// Import the logo image
import logoImage from '../images/arcv-logo.png';

// Import the FolderContentsPage component
import FolderContentsPage from './FolderContentsPage';
// Import the ProfileDropdown component
import ProfileDropdown from './ProfileDropdown';

const SimpleFoldersPage = ({ onBack, onGoToFolders }) => {
  const [folders, setFolders] = useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortMenuPosition, setSortMenuPosition] = useState({ top: 0, left: 0 });
  const [sortOption, setSortOption] = useState('newest');
  const [activeTag, setActiveTag] = useState(null);
  const [gridSize, setGridSize] = useState(4); // Default is 4 columns
  
  // State for folder content view
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [viewingFolderContents, setViewingFolderContents] = useState(false);
  
  // Refs for positioning and hover handling
  const sortIconRef = useRef(null);
  const menuRefs = useRef({});
  const dropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  
  // New folder modal state
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [newFolderData, setNewFolderData] = useState({
    title: "New Folder",
    tags: [], // Start with no tags
    images: []
  });

  // Reference to file input for image upload
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

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

  // Apply current sort option whenever the filtered folders change
  useEffect(() => {
    if (filteredFolders.length > 0) {
      handleSortChange(sortOption, false); // Don't close menu when sorting is triggered by filter changes
    }
  }, [activeTag, searchTerm]);

  // Close sort menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortMenuOpen && sortIconRef.current && !sortIconRef.current.contains(event.target) &&
          sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setSortMenuOpen(false);
      }
      
      // Close any active folder menu when clicking outside, but allow clicking the menu buttons
      if (activeMenu && !event.target.closest('.simple-menu-dots') && !event.target.closest('.simple-dropdown button')) {
        setActiveMenu(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sortMenuOpen, activeMenu]);

  // Handle mouse enter for menu with position calculation
  const handleMenuMouseEnter = (folderId, e) => {
    e.stopPropagation();
    
    // Calculate position for the dropdown menu
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.top,
      left: rect.left + rect.width
    });
    
    setActiveMenu(folderId);
  };
  
  // Handle mouse leave for menu
  const handleMenuMouseLeave = (e) => {
    // Only close if not hovering over the dropdown menu
    if (!dropdownRef.current || !dropdownRef.current.contains(e.relatedTarget)) {
      setActiveMenu(null);
    }
  };
  
  // Handle mouse enter for dropdown to keep it open
  const handleDropdownMouseEnter = () => {
    // Keep the dropdown open
  };
  
  // Handle mouse leave for dropdown
  const handleDropdownMouseLeave = () => {
    setActiveMenu(null);
  };

  // Handle folder click - now opens the folder contents view
  const handleFolderClick = (folderId) => {
    // Find the selected folder
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setSelectedFolder(folder);
      setViewingFolderContents(true);
    }
  };

  // Handle folder contents view back button click
  const handleFolderContentsBack = () => {
    setViewingFolderContents(false);
    setSelectedFolder(null);
  };

  // Edit folder click
  const handleEditClick = (folderId, e) => {
    e.stopPropagation();
    
    // Find the folder to edit
    const folderToEdit = folders.find(folder => folder.id === folderId);
    
    // Set editing mode data - ensure we properly initialize images array with existing imageUrl
    setEditingFolderId(folderId);
    setNewFolderData({
      title: folderToEdit.name,
      tags: [...folderToEdit.tags],
      images: folderToEdit.imageUrl ? [folderToEdit.imageUrl] : []
    });
    
    // Show edit modal
    setShowEditFolderModal(true);
    
    // Close the dropdown menu
    setActiveMenu(null);
  };
  
  // Duplicate folder click
  const handleDuplicateClick = (folderId, e) => {
    e.stopPropagation();
    
    // Find the folder to duplicate
    const folderToDuplicate = folders.find(folder => folder.id === folderId);
    
    // Create a new folder with the duplicated data
    const newFolder = {
      id: Date.now(), // new unique ID
      name: `${folderToDuplicate.name} (copy)`,
      tags: [...folderToDuplicate.tags],
      imageUrl: folderToDuplicate.imageUrl
    };
    
    // Add to folders array
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    setFilteredFolders(updatedFolders);
    
    // Close the dropdown menu
    setActiveMenu(null);
  };

  // Handle delete click
  const handleDeleteClick = (folderId, e) => {
    e.stopPropagation();
    setFolderToDelete(folderId);
    setShowConfirmDialog(true);
    setActiveMenu(null);
  };

  // Download folder data
  const handleDownloadClick = (folderId, e) => {
    e.stopPropagation();
    
    // Find the folder to download
    const folderToDownload = folders.find(folder => folder.id === folderId);
    
    // Create a downloadable JSON
    const dataStr = JSON.stringify(folderToDownload, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // Create a download link and trigger it
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataUri);
    downloadAnchorNode.setAttribute("download", `${folderToDownload.name.replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    // Close the dropdown menu
    setActiveMenu(null);
  };

  // Confirm folder deletion
  const confirmDelete = () => {
    const updatedFolders = folders.filter(folder => folder.id !== folderToDelete);
    setFolders(updatedFolders);
    setFilteredFolders(updatedFolders);
    setShowConfirmDialog(false);
    setFolderToDelete(null);
  };

  // Cancel folder deletion
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
  
  // Handle sort icon click with position calculation
  const handleSortIconClick = (e) => {
    // Get the position of the sort icon
    const rect = sortIconRef.current.getBoundingClientRect();
    
    // Calculate position for the dropdown menu
    setSortMenuPosition({
      top: rect.bottom + 5, // Position below the icon with a small gap
      left: rect.left,
      right: window.innerWidth - rect.right
    });
    
    // Toggle sort menu
    setSortMenuOpen(!sortMenuOpen);
  };
  
  // Handle new folder button click
  const handleNewFolderClick = () => {
    setNewFolderData({
      title: "New Folder",
      tags: [], // Start with no tags
      images: []
    });
    setShowNewFolderModal(true);
  };
  
  // Handle adding a new tag (for both new and edit modes)
  const handleAddNewTag = () => {
    setNewFolderData({
      ...newFolderData,
      tags: [...newFolderData.tags, ""] // Add an empty tag
    });
  };
  
  // Handle tag input change (for both new and edit modes)
  const handleNewFolderTagChange = (index, value) => {
    const updatedTags = [...newFolderData.tags];
    // Remove # if it exists when storing in the array
    updatedTags[index] = value.startsWith('#') ? value.substring(1) : value;
    setNewFolderData({ ...newFolderData, tags: updatedTags });
  };
  
  // Remove tag from folder data (for both new and edit modes)
  const handleRemoveNewFolderTag = (index) => {
    const updatedTags = newFolderData.tags.filter((_, i) => i !== index);
    setNewFolderData({ ...newFolderData, tags: updatedTags });
  };
  
  // Unified function to handle adding image to folder (works for both new and edit modals)
  const handleAddImage = (fileInputRef) => {
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file selection for image upload (for both new and edit modes)
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        // Add the image URL to the folder data (replacing any existing images)
        setNewFolderData({
          ...newFolderData,
          images: [event.target.result] // Replace existing images with the new one
        });
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Create a new folder
  const handleCreateFolder = () => {
    // Create a new folder with the entered data
    const newFolder = {
      id: Date.now(), // use timestamp as a simple unique ID
      name: newFolderData.title.toLowerCase(), // Store name in lowercase to match design
      tags: newFolderData.tags.filter(tag => tag.trim() !== ''), // Filter out empty tags
      imageUrl: newFolderData.images.length ? newFolderData.images[0] : 
        "https://via.placeholder.com/300/eeeeee/333333?text=New+Folder"
    };
    
    // Add the new folder to state
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    
    // Apply the current filter and sort to include the new folder
    const filtered = applyFilter(updatedFolders);
    setFilteredFolders(applySorting(filtered, sortOption));
    
    // Close the modal
    setShowNewFolderModal(false);
  };
  
  // Apply the current filter to a set of folders
  const applyFilter = (foldersList) => {
    if (searchTerm.trim() === '' && !activeTag) {
      return foldersList;
    }
    
    let filtered = foldersList;
    
    // Apply search term filter
    if (searchTerm.trim() !== '') {
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(folder => {
        const nameMatch = folder.name.toLowerCase().includes(normalizedSearchTerm);
        const tagMatch = folder.tags.some(tag => 
          tag.toLowerCase().includes(normalizedSearchTerm)
        );
        return nameMatch || tagMatch;
      });
    }
    
    // Apply tag filter
    if (activeTag) {
      filtered = filtered.filter(folder => 
        folder.tags.includes(activeTag)
      );
    }
    
    return filtered;
  };
  
  // Apply a specific sort option to a list of folders
  const applySorting = (foldersList, option) => {
    let sorted = [...foldersList];
    
    switch(option) {
      case 'newest':
        sorted.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        sorted.sort((a, b) => a.id - b.id);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        sorted.sort((a, b) => b.id - a.id);
    }
    
    return sorted;
  };
  
  // Save the edited folder
  const handleSaveEditedFolder = () => {
    // Update the folder data
    const updatedFolders = folders.map(folder => {
      if (folder.id === editingFolderId) {
        return {
          ...folder,
          name: newFolderData.title.toLowerCase(),
          tags: newFolderData.tags.filter(tag => tag.trim() !== ''),
          imageUrl: newFolderData.images.length ? newFolderData.images[0] : folder.imageUrl
        };
      }
      return folder;
    });
    
    // Update state
    setFolders(updatedFolders);
    
    // Apply the current filter and sort to include the edited folder
    const filtered = applyFilter(updatedFolders);
    setFilteredFolders(applySorting(filtered, sortOption));
    
    // Close the edit modal
    setShowEditFolderModal(false);
    setEditingFolderId(null);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort selection - Updated to use name-based sorting
  const handleSortChange = (option, closeMenu = true) => {
    // Set the new sort option
    setSortOption(option);
    
    // Close the menu if requested (e.g. when user clicks a sort option)
    if (closeMenu) {
      setSortMenuOpen(false);
    }
    
    // Apply sorting to filtered folders
    setFilteredFolders(applySorting(filteredFolders, option));
  };
  
  // Handle grid size slider change
  const handleGridSizeChange = (e) => {
    setGridSize(parseInt(e.target.value, 10));
  };

  // If viewing folder contents, render the FolderContentsPage
  if (viewingFolderContents && selectedFolder) {
    return (
      <FolderContentsPage 
        folder={selectedFolder} 
        onBack={handleFolderContentsBack}
        onSaveProduct={() => console.log('Save product functionality would be implemented here')}
        onGoToFolders={onGoToFolders}
      />
    );
  }

  // Otherwise, render the folders page
  return (
    <div className="simple-folders-page">
      {/* Header with logo and search */}
      <div className="simple-header">
        {/* Logo that acts as a back button */}
        <div className="simple-logo" onClick={() => onBack && onBack()}>
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
          
          {/* Sort dropdown button with ref for positioning - Updated to match Figma style */}
          <div 
            className="simple-sort-icon" 
            onClick={handleSortIconClick}
            ref={sortIconRef}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 14l5 5 5-5M7 10l5-5 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="simple-controls">
          {/* ProfileDropdown component with onGoToFolders prop */}
          <ProfileDropdown onGoToFolders={onGoToFolders} />
        </div>
      </div>
      
      {/* Sort dropdown menu positioned absolutely */}
      {sortMenuOpen && (
        <div 
          className="simple-sort-dropdown" 
          style={{ 
            position: 'fixed',
            top: `${sortMenuPosition.top}px`,
            left: `${sortMenuPosition.left}px`,
            zIndex: 1000
          }}
          ref={sortDropdownRef}
        >
          <div 
            className={`simple-sort-option ${sortOption === 'newest' ? 'active' : ''}`} 
            onClick={() => handleSortChange('newest')}
          >
            Newest to Oldest
          </div>
          <div 
            className={`simple-sort-option ${sortOption === 'oldest' ? 'active' : ''}`} 
            onClick={() => handleSortChange('oldest')}
          >
            Oldest to Newest
          </div>
          <div 
            className={`simple-sort-option ${sortOption === 'name-asc' ? 'active' : ''}`} 
            onClick={() => handleSortChange('name-asc')}
          >
            Name: A to Z
          </div>
          <div 
            className={`simple-sort-option ${sortOption === 'name-desc' ? 'active' : ''}`} 
            onClick={() => handleSortChange('name-desc')}
          >
            Name: Z to A
          </div>
        </div>
      )}
      
      {/* Grid size control - Modified layout */}
      <div className="simple-grid-controls">
        {/* Grid size slider - Moved to left side */}
        <div className="simple-grid-slider">
          <div className="simple-slider-icon small">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <input
            type="range"
            min="3"
            max="6"
            value={gridSize}
            onChange={handleGridSizeChange}
            className="simple-range-slider"
          />
          <div className="simple-slider-icon large">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="10" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="18" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="2" y="10" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="10" y="10" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="18" y="10" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="2" y="18" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="10" y="18" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="18" y="18" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>
        
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
      
      {/* Folders grid - dynamic columns based on gridSize */}
      {loading ? (
        <div className="simple-loading">Loading folders...</div>
      ) : filteredFolders.length === 0 ? (
        <div className="simple-no-results">No folders match your search</div>
      ) : (
        <div className={`simple-folders-grid grid-cols-${gridSize}`}>
          {filteredFolders.map((folder) => (
            <div 
              key={folder.id} 
              className="simple-folder-item-container"
            >
              <div 
                className="simple-folder-item"
                onClick={() => handleFolderClick(folder.id)}
              >
                {/* Folder box with image */}
                <div className="simple-folder-box">
                  {/* Menu button in top left with hover handlers */}
                  <div 
                    className="simple-menu-dots" 
                    onMouseEnter={(e) => handleMenuMouseEnter(folder.id, e)}
                    onMouseLeave={handleMenuMouseLeave}
                    ref={el => menuRefs.current[folder.id] = el}
                  >
                    •••
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
            </div>
          ))}
          
          {/* New folder button - dashed rectangle */}
          <div className="simple-folder-item-container">
            <div className="simple-folder-item" onClick={handleNewFolderClick}>
              <div className="simple-new-folder">
                <div className="simple-plus-icon">+</div>
              </div>
              <div className="simple-folder-info">
                <div className="simple-folder-title">:new folder</div>
                <div className="simple-folder-tags">
                  <span className="simple-folder-tag">#new</span>
                  <span className="simple-folder-tag">#folder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Dropdown menu positioned absolutely in the DOM */}
      {activeMenu && (
        <div 
          className="simple-dropdown"
          style={{ 
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`
          }}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
          ref={dropdownRef}
        >
          <button onClick={(e) => handleEditClick(activeMenu, e)}>
            <span className="simple-menu-icon">
              {/* Edit icon */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#333"/>
              </svg>
            </span>
            Edit Information
          </button>
          <button onClick={(e) => handleDuplicateClick(activeMenu, e)}>
            <span className="simple-menu-icon">
              {/* Duplicate icon */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="#333"/>
              </svg>
            </span>
            Duplicate
          </button>
          <button onClick={(e) => handleDeleteClick(activeMenu, e)}>
            <span className="simple-menu-icon">
              {/* Delete icon */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#333"/>
              </svg>
            </span>
            Delete
          </button>
          <button>
            <span className="simple-menu-icon">
              {/* Send icon */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2 .01 7z" fill="#333"/>
              </svg>
            </span>
            Send
          </button>
          <button onClick={(e) => handleDownloadClick(activeMenu, e)}>
            <span className="simple-menu-icon">
              {/* Download icon */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="#333"/>
              </svg>
            </span>
            Download
          </button>
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
      
      {/* New Folder Modal - Updated tag UI and removed Add Tag button */}
      {showNewFolderModal && (
        <div className="simple-overlay" onClick={() => setShowNewFolderModal(false)}>
          <div className="simple-modal create-mode" onClick={(e) => e.stopPropagation()}>
            <div className="simple-form">
              <div className="simple-form-group">
                <label>Folder Name</label>
                <input 
                  type="text" 
                  value={newFolderData.title}
                  onChange={(e) => setNewFolderData({...newFolderData, title: e.target.value})}
                />
              </div>
              
              {/* Updated Tags UI - Single Box with X - Removed Add Tag button */}
              <div className="simple-form-group">
                <label>Tags</label>
                <div className="simple-tags-container">
                  {newFolderData.tags.map((tag, index) => (
                    <div key={index} className="simple-single-tag">
                      <span className="simple-tag-text">{tag}</span>
                      <button 
                        className="simple-tag-remove-btn"
                        onClick={() => handleRemoveNewFolderTag(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <input 
                    type="text"
                    className="simple-tag-input"
                    placeholder="Enter tag and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        const newTag = e.target.value.trim();
                        setNewFolderData({
                          ...newFolderData,
                          tags: [...newFolderData.tags, newTag]
                        });
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="simple-form-group">
                <label>Images</label>
                <div className="simple-images-preview">
                  {newFolderData.images.map((img, index) => (
                    <div key={index} className="simple-preview">
                      <img src={img} alt={`Preview ${index}`} />
                    </div>
                  ))}
                  
                  <div className="simple-add-image" onClick={() => handleAddImage(fileInputRef)}>
                    <span>+</span>
                    <p>Add Image</p>
                  </div>
                  
                  {/* Hidden file input for image upload */}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
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
      
      {/* Edit Folder Modal - Updated to show image previews just like the New Folder modal */}
      {showEditFolderModal && (
        <div className="simple-overlay" onClick={() => setShowEditFolderModal(false)}>
          <div className="simple-modal edit-mode" onClick={(e) => e.stopPropagation()}>
            <div className="simple-form">
              <div className="simple-form-group">
                <label>Folder Name</label>
                <input 
                  type="text" 
                  value={newFolderData.title}
                  onChange={(e) => setNewFolderData({...newFolderData, title: e.target.value})}
                />
              </div>
              
              {/* Updated Tags UI - Single Box with X - Removed Add Tag button */}
              <div className="simple-form-group">
                <label>Tags</label>
                <div className="simple-tags-container">
                  {newFolderData.tags.map((tag, index) => (
                    <div key={index} className="simple-single-tag">
                      <span className="simple-tag-text">{tag}</span>
                      <button 
                        className="simple-tag-remove-btn"
                        onClick={() => handleRemoveNewFolderTag(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <input 
                    type="text"
                    className="simple-tag-input"
                    placeholder="Enter tag and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        const newTag = e.target.value.trim();
                        setNewFolderData({
                          ...newFolderData,
                          tags: [...newFolderData.tags, newTag]
                        });
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Updated image section - Now shows image previews just like the New Folder modal */}
              <div className="simple-form-group">
                <label>Images</label>
                <div className="simple-images-preview">
                  {/* Show previews of existing images, just like in New Folder modal */}
                  {newFolderData.images.map((img, index) => (
                    <div key={index} className="simple-preview">
                      <img src={img} alt={`Preview ${index}`} />
                    </div>
                  ))}
                  
                  <div className="simple-add-image" onClick={() => handleAddImage(editFileInputRef)}>
                    <span>+</span>
                    <p>Add Image</p>
                  </div>
                  
                  {/* Hidden file input for image upload */}
                  <input 
                    type="file" 
                    ref={editFileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>
            </div>
            
            <div className="simple-modal-actions">
              <button 
                className="simple-cancel-btn"
                onClick={() => setShowEditFolderModal(false)}
              >
                Cancel
              </button>
              <button 
                className="simple-create-btn"
                onClick={handleSaveEditedFolder}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleFoldersPage;