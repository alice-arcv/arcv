import React, { useState, useEffect, useRef } from 'react';
// Import the same CSS for consistent styling
import '../styles/simple-folders.css';
import '../styles/folder-contents.css';

// Import the logo image
import logoImage from '../images/arcv-logo.png';
// Import the ProfileDropdown component
import ProfileDropdown from './ProfileDropdown';

const FolderContentsPage = ({ folder, onBack, onSaveProduct, onGoToFolders }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortMenuPosition, setSortMenuPosition] = useState({ top: 0, left: 0 });
  const [sortOption, setSortOption] = useState('newest');
  const [activeTag, setActiveTag] = useState(null);
  const [gridSize, setGridSize] = useState(4); // Default is 4 columns
  
  // View mode state
  const [viewMode, setViewMode] = useState('grid'); // Default view mode
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  
  // Selected products state for download/share functionality
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  // Interactive mode specific state
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTool, setActiveTool] = useState('select');
  const [interactiveItems, setInteractiveItems] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const [selectedInteractiveItem, setSelectedInteractiveItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeUsers, setActiveUsers] = useState([
    { id: 1, name: 'Alice', color: '#47956f' },
    { id: 2, name: 'Bob', color: '#4672b4' }
  ]);
  
  // New states for improved interactive mode
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [toolDropdownOpen, setToolDropdownOpen] = useState('');
  
  // New states for enhanced features
  const [boardScale, setBoardScale] = useState(1);
  const [boardPosition, setBoardPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [colorWheelOpen, setColorWheelOpen] = useState(false);
  const [colorWheelPosition, setColorWheelPosition] = useState({ x: 0, y: 0 });
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isAddingText, setIsAddingText] = useState(false);
  const [hexColor, setHexColor] = useState('#1A1A1A');
  
  // Boundary limits for the interactive board
  const boardLimits = {
    minScale: 0.5, // Allow zooming out to 50%
    maxScale: 5,
    minX: -5000,
    maxX: 5000,
    minY: -5000,
    maxY: 5000
  };
  
  // Colors for tools
  const colors = [
    '#FF0000', // Red
    '#FF9900', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#9900FF', // Purple
    '#FF00FF', // Pink
    '#000000', // Black
    '#FFFFFF', // White
  ];
  
  // Refs for dropdown positioning and interactive board
  const sortIconRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const viewButtonRef = useRef(null);
  const boardRef = useRef(null);
  const productButtonRef = useRef(null);
  const colorPickerRef = useRef(null);
  const colorWheelRef = useRef(null);
  const editInputRef = useRef(null);
  const toolsRefs = {
    marker: useRef(null),
    highlighter: useRef(null),
    text: useRef(null)
  };

  // Generate mock product data based on folder - in a real app, this would come from a database
  useEffect(() => {
    if (!folder) {
      setLoading(false);
      return;
    }

    // Mock products for demonstration
    const generateMockProducts = () => {
      const mockProducts = [];
      // Create between 5-15 products
      const productCount = Math.floor(Math.random() * 10) + 5;
      
      for (let i = 0; i < productCount; i++) {
        mockProducts.push({
          id: `product-${folder.id}-${i}`,
          name: `${folder.name.toUpperCase()} ${i+1}`,
          brand: folder.tags.includes('nike') ? 'Nike' : 
                 folder.tags.includes('adidas') ? 'Adidas' : 
                 'Brand X',
          colorway: `${getRandomColor()}/${getRandomColor()}`,
          imageUrl: `https://via.placeholder.com/300/${getRandomColorHex()}/FFFFFF?text=Product+${i+1}`,
          releaseDate: getRandomDate(),
          retailPrice: getRandomPrice(),
          tags: [...folder.tags, getRandomTag()],
          addedOn: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
        });
      }
      
      return mockProducts;
    };
    
    const mockProducts = generateMockProducts();
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    
    // Create interactive items for the board with random positions
    const boardItems = mockProducts.slice(0, 8).map((product, index) => ({
      id: product.id,
      type: 'image',
      product,
      x: 100 + (index % 4) * 220,
      y: 100 + Math.floor(index / 4) * 220,
      width: 180,
      height: 180,
      rotation: 0,
      zIndex: index
    }));
    
    setInteractiveItems(boardItems);
    setLoading(false);
  }, [folder]);

  // Helper functions for mock data generation
  const getRandomColor = () => {
    const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Gray', 'Orange', 'Purple'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const getRandomColorHex = () => {
    return Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  };
  
  const getRandomDate = () => {
    const start = new Date(2018, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
  };
  
  const getRandomPrice = () => {
    return (Math.floor(Math.random() * 15) + 10) * 10; // $100-$250 range
  };
  
  const getRandomTag = () => {
    const tags = ['running', 'casual', 'basketball', 'limited', 'exclusive', 'retro', 'new'];
    return tags[Math.floor(Math.random() * tags.length)];
  };

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // If no search term, but there's an active tag, filter by that tag
      if (activeTag) {
        const filtered = products.filter(product => 
          product.tags.includes(activeTag)
        );
        setFilteredProducts(filtered);
      } else {
        // No search term and no active tag, show all products
        setFilteredProducts(products);
      }
    } else {
      // Filter products based on search term
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      const filtered = products.filter(product => {
        // Check if search term is in product name
        const nameMatch = product.name.toLowerCase().includes(normalizedSearchTerm);
        
        // Check if search term is in brand
        const brandMatch = product.brand.toLowerCase().includes(normalizedSearchTerm);
        
        // Check if search term is in any tag
        const tagMatch = product.tags.some(tag => 
          tag.toLowerCase().includes(normalizedSearchTerm)
        );
        
        return nameMatch || brandMatch || tagMatch;
      });
      
      // If there's an active tag, further filter by that tag
      if (activeTag) {
        const tagFiltered = filtered.filter(product => 
          product.tags.includes(activeTag)
        );
        setFilteredProducts(tagFiltered);
      } else {
        setFilteredProducts(filtered);
      }
    }
  }, [searchTerm, products, activeTag]);

  // Apply current sort option whenever the filtered products change
  useEffect(() => {
    if (filteredProducts.length > 0) {
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

      if (viewDropdownOpen && viewButtonRef.current && !viewButtonRef.current.contains(event.target)) {
        setViewDropdownOpen(false);
      }

      if (productDropdownOpen && productButtonRef.current && !productButtonRef.current.contains(event.target)) {
        setProductDropdownOpen(false);
      }

      if (colorPickerOpen && colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setColorPickerOpen(false);
      }

      if (colorWheelOpen && colorWheelRef.current && !colorWheelRef.current.contains(event.target)) {
        setColorWheelOpen(false);
      }

      // Close any tool dropdowns when clicking outside
      if (toolDropdownOpen && 
          toolsRefs[toolDropdownOpen]?.current && 
          !toolsRefs[toolDropdownOpen].current.contains(event.target)) {
        setToolDropdownOpen('');
      }
      
      // Handle finishing editing when clicking outside edit field
      if (isEditing && editInputRef.current && !editInputRef.current.contains(event.target)) {
        finishEditing();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sortMenuOpen, viewDropdownOpen, productDropdownOpen, colorPickerOpen, toolDropdownOpen, colorWheelOpen, isEditing]);

  // Set focus on edit input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  // Handle product click - would typically navigate to a detail view
  const handleProductClick = (product) => {
    if (isSelectionMode) {
      toggleProductSelection(product.id);
    } else {
      console.log(`Viewing product ${product.id}`);
      // Navigate to product detail view or show modal
    }
  };

  // Handle product selection for download/share
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prevSelected => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter(id => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      // Clear selections when exiting selection mode
      setSelectedProducts([]);
    }
  };

  // Handle hashtag click
  const handleTagClick = (tag, e) => {
    e.stopPropagation(); // Prevent product click
    
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

  // Handle sort selection
  const handleSortChange = (option, closeMenu = true) => {
    // Set the new sort option
    setSortOption(option);
    
    // Close the menu if requested (e.g. when user clicks a sort option)
    if (closeMenu) {
      setSortMenuOpen(false);
    }
    
    // Apply sorting to filtered products
    setFilteredProducts(applySorting(filteredProducts, option));
  };
  
  // Apply a specific sort option to a list of products
  const applySorting = (productsList, option) => {
    let sorted = [...productsList];
    
    switch(option) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.addedOn) - new Date(a.addedOn));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.addedOn) - new Date(b.addedOn));
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.retailPrice - b.retailPrice);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.retailPrice - a.retailPrice);
        break;
      default:
        sorted.sort((a, b) => new Date(b.addedOn) - new Date(a.addedOn));
    }
    
    return sorted;
  };

  // Handle grid size slider change
  const handleGridSizeChange = (e) => {
    setGridSize(parseInt(e.target.value, 10));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setViewDropdownOpen(false);
  };

  // Toggle view dropdown
  const toggleViewDropdown = () => {
    setViewDropdownOpen(!viewDropdownOpen);
  };

  // Handle download action
  const handleDownload = () => {
    const itemsToDownload = selectedProducts.length > 0 
      ? selectedProducts 
      : filteredProducts.map(p => p.id);
    
    console.log(`Downloading products: ${itemsToDownload.join(', ')}`);
    // Implement actual download functionality here
    alert(`Download initiated for ${itemsToDownload.length} products`);
  };

  // Handle share action
  const handleShare = () => {
    const itemsToShare = selectedProducts.length > 0 
      ? selectedProducts 
      : filteredProducts.map(p => p.id);
    
    console.log(`Sharing products: ${itemsToShare.join(', ')}`);
    // Implement actual sharing functionality here
    alert(`Sharing ${itemsToShare.length} products`);
  };

  // Handle view shared users
  const handleViewUsers = () => {
    console.log('Viewing shared users');
    // Implement showing shared users functionality
    alert('Viewing users shared on this folder');
  };

  // Toggle dark/light mode for interactive board
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Toggle product dropdown
  const toggleProductDropdown = () => {
    setProductDropdownOpen(!productDropdownOpen);
    // Close other dropdowns
    setToolDropdownOpen('');
    setColorPickerOpen(false);
    setColorWheelOpen(false);
  };

  // Handle tool dropdown toggle
  const toggleToolDropdown = (tool) => {
    if (toolDropdownOpen === tool) {
      setToolDropdownOpen('');
    } else {
      setToolDropdownOpen(tool);
      setProductDropdownOpen(false);
      setColorWheelOpen(false);
    }
  };

  // Open color wheel at specified position
  const openColorWheel = (e, tool) => {
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    
    setColorWheelPosition({
      top: rect.bottom + 5,
      left: rect.left
    });
    
    setToolDropdownOpen('');
    setColorWheelOpen(true);
    setActiveTool(tool); // Set the active tool as the one for which color is being changed
  };

  // Handle color selection from color wheel
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setHexColor(color);
    setColorWheelOpen(false);
  };

  // Handle hex color input change
  const handleHexInputChange = (e) => {
    setHexColor(e.target.value);
    // Update the selected color if it's a valid hex
    if (/^#([0-9A-F]{3}){1,2}$/i.test(e.target.value)) {
      setSelectedColor(e.target.value);
    }
  };

  // Change the active tool for interactive board
  const handleToolChange = (tool) => {
    setActiveTool(tool);
    setIsDrawing(false);
    setSelectedInteractiveItem(null);
    setSelectedAnnotation(null);
    setToolDropdownOpen('');
    
    // Reset adding states when changing tools
    if (tool !== 'comment') setIsAddingComment(false);
    if (tool !== 'tag') setIsAddingTag(false);
    if (tool !== 'text') setIsAddingText(false);
  };

  // Get default text color based on mode
  const getDefaultTextColor = () => {
    return isDarkMode ? '#FFFCEB' : '#1E1E1E';
  };

  // Get default background color based on mode
  const getDefaultBgColor = () => {
    return isDarkMode ? '#1E1E1E' : '#FFFCEB';
  };

  // Handle mouse down on interactive board
  const handleBoardMouseDown = (e) => {
    if (!boardRef.current) return;
    
    // If the space key is held down, start panning
    if (e.buttons === 2 || e.altKey) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }
    
    const boardRect = boardRef.current.getBoundingClientRect();
    
    // Calculate the actual position on the board, taking into account scale and pan
    const x = (e.clientX - boardRect.left - boardPosition.x) / boardScale;
    const y = (e.clientY - boardRect.top - boardPosition.y) / boardScale;
    
    // First check if we're clicking on the selected annotation for editing
    if (selectedAnnotation && 
        (selectedAnnotation.type === 'note' || selectedAnnotation.type === 'tag' || selectedAnnotation.type === 'text')) {
      // Calculate bounds of the annotation
      const annotBounds = getAnnotationBounds(selectedAnnotation);
      
      if (x >= annotBounds.x && x <= annotBounds.x + annotBounds.width &&
          y >= annotBounds.y && y <= annotBounds.y + annotBounds.height) {
        // If not already editing, start editing the annotation
        if (!isEditing) {
          startEditing(selectedAnnotation);
        }
        return;
      }
    }
    
    // Check if we're clicking on an existing annotation
    const clickedAnnotation = annotations.find(annot => {
      if (annot.type === 'line') return false; // Lines handled differently
      
      const bounds = getAnnotationBounds(annot);
      return (
        x >= bounds.x && 
        x <= bounds.x + bounds.width && 
        y >= bounds.y && 
        y <= bounds.y + bounds.height
      );
    });
    
    if (clickedAnnotation) {
      e.stopPropagation();
      if (activeTool === 'select') {
        setSelectedAnnotation(clickedAnnotation);
        setSelectedInteractiveItem(null);
        setIsDragging(true);
        const bounds = getAnnotationBounds(clickedAnnotation);
        setDragOffset({
          x: x - bounds.x,
          y: y - bounds.y
        });
        return;
      }
    } else {
      // Check if we're clicking on an existing item
      const clickedItem = interactiveItems.find(item => {
        return (
          x >= item.x && 
          x <= item.x + item.width && 
          y >= item.y && 
          y <= item.y + item.height
        );
      });
      
      if (clickedItem) {
        if (activeTool === 'select') {
          // Start dragging the item
          setSelectedInteractiveItem(clickedItem);
          setSelectedAnnotation(null);
          setIsDragging(true);
          setDragOffset({
            x: x - clickedItem.x,
            y: y - clickedItem.y
          });
          return;
        }
      } else {
        // Not clicking on any existing elements, clear selection
        setSelectedAnnotation(null);
        setSelectedInteractiveItem(null);
      }
    }
    
    // Handle creation of new elements based on active tool
    if (activeTool === 'marker' || activeTool === 'highlighter') {
      // Start drawing a new annotation
      setIsDrawing(true);
      setCurrentAnnotation({
        id: Date.now(),
        type: 'line',
        color: selectedColor,
        points: [{ x, y }],
        strokeWidth: activeTool === 'marker' ? 2 : 8,
        opacity: activeTool === 'marker' ? 1 : 0.5
      });
    } else if (activeTool === 'comment' && !isAddingComment) {
      // Add a new note
      const noteColor = getDefaultBgColor();
      const textColor = getDefaultTextColor();
      
      const newNote = {
        id: Date.now(),
        type: 'note',
        x,
        y,
        width: 150,
        height: 100,
        text: 'Add comment here',
        color: noteColor,
        textColor: textColor
      };
      
      setAnnotations([...annotations, newNote]);
      setSelectedAnnotation(newNote);
      setIsEditing(true);
      setEditText('Add comment here');
      setIsAddingComment(true);
    } else if (activeTool === 'tag' && !isAddingTag) {
      // Add a new tag
      const tagColor = getDefaultBgColor();
      const textColor = getDefaultTextColor();
      
      const newTag = {
        id: Date.now(),
        type: 'tag',
        x,
        y,
        text: 'New Tag',
        color: tagColor,
        textColor: textColor
      };
      
      setAnnotations([...annotations, newTag]);
      setSelectedAnnotation(newTag);
      setIsEditing(true);
      setEditText('New Tag');
      setIsAddingTag(true);
    } else if (activeTool === 'text' && !isAddingText) {
      // Add a new text
      const newText = {
        id: Date.now(),
        type: 'text',
        x,
        y,
        text: 'Enter text here',
        color: selectedColor,
        fontSize: 16
      };
      
      setAnnotations([...annotations, newText]);
      setSelectedAnnotation(newText);
      setIsEditing(true);
      setEditText('Enter text here');
      setIsAddingText(true);
    }
  };

  // Helper to get annotation bounds
  const getAnnotationBounds = (annotation) => {
    switch (annotation.type) {
      case 'note':
        return {
          x: annotation.x,
          y: annotation.y,
          width: annotation.width,
          height: annotation.height
        };
      case 'tag':
        // For tags, we estimate the width based on text length
        return {
          x: annotation.x,
          y: annotation.y,
          width: annotation.text.length * 8 + 16, // Approximation
          height: 24
        };
      case 'text':
        // For text, we estimate the width based on text length
        return {
          x: annotation.x,
          y: annotation.y,
          width: annotation.text.length * annotation.fontSize * 0.6, // Approximation
          height: annotation.fontSize * 1.2
        };
      default:
        return { x: 0, y: 0, width: 0, height: 0 };
    }
  };

  // Start editing an annotation
  const startEditing = (annotation) => {
    setIsEditing(true);
    setEditText(annotation.text);
    setSelectedAnnotation(annotation);
  };

  // Handle changes to edit input
  const handleEditChange = (e) => {
    setEditText(e.target.value);
  };

  // Finish editing and save changes
  const finishEditing = () => {
    if (!selectedAnnotation) {
      setIsEditing(false);
      return;
    }
    
    // Update the annotation with the new text
    const updatedAnnotations = annotations.map(annot => {
      if (annot.id === selectedAnnotation.id) {
        return {
          ...annot,
          text: editText
        };
      }
      return annot;
    });
    
    setAnnotations(updatedAnnotations);
    setIsEditing(false);
    
    // Update the selectedAnnotation with the new text
    setSelectedAnnotation({
      ...selectedAnnotation,
      text: editText
    });
    
    // Reset adding states
    setIsAddingComment(false);
    setIsAddingTag(false);
    setIsAddingText(false);
  };

  // Delete the selected annotation
  const deleteSelectedAnnotation = () => {
    if (!selectedAnnotation) return;
    
    const updatedAnnotations = annotations.filter(
      annot => annot.id !== selectedAnnotation.id
    );
    
    setAnnotations(updatedAnnotations);
    setSelectedAnnotation(null);
    setIsEditing(false);
  };

  // Handle key presses for editing and deleting
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && isEditing) {
      e.preventDefault();
      finishEditing();
    } else if (e.key === 'Escape') {
      if (isEditing) {
        setIsEditing(false);
        
        // Reset adding states if cancelling a new element
        setIsAddingComment(false);
        setIsAddingTag(false);
        setIsAddingText(false);
        
        // Remove the annotation if it was newly added
        if (isAddingComment || isAddingTag || isAddingText) {
          const updatedAnnotations = annotations.filter(
            annot => annot.id !== selectedAnnotation?.id
          );
          setAnnotations(updatedAnnotations);
        }
      }
      setSelectedAnnotation(null);
      setSelectedInteractiveItem(null);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedAnnotation && !isEditing) {
        deleteSelectedAnnotation();
      }
    }
  };

  // Handle mouse move on interactive board
  const handleBoardMouseMove = (e) => {
    if (!boardRef.current) return;
    
    // Handle panning
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      
      // Apply limits to panning
      setBoardPosition(prev => ({
        x: Math.max(boardLimits.minX, Math.min(boardLimits.maxX, prev.x + dx)),
        y: Math.max(boardLimits.minY, Math.min(boardLimits.maxY, prev.y + dy))
      }));
      
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }
    
    const boardRect = boardRef.current.getBoundingClientRect();
    
    // Calculate the actual position on the board, taking into account scale and pan
    const x = (e.clientX - boardRect.left - boardPosition.x) / boardScale;
    const y = (e.clientY - boardRect.top - boardPosition.y) / boardScale;
    
    if (isDragging) {
      if (selectedInteractiveItem) {
        // Update the position of the dragged item
        const updatedItems = interactiveItems.map(item => {
          if (item.id === selectedInteractiveItem.id) {
            return {
              ...item,
              x: x - dragOffset.x,
              y: y - dragOffset.y
            };
          }
          return item;
        });
        
        setInteractiveItems(updatedItems);
        setSelectedInteractiveItem({
          ...selectedInteractiveItem,
          x: x - dragOffset.x,
          y: y - dragOffset.y
        });
      } else if (selectedAnnotation) {
        // Update the position of the dragged annotation
        const updatedAnnotations = annotations.map(annot => {
          if (annot.id === selectedAnnotation.id) {
            return {
              ...annot,
              x: x - dragOffset.x,
              y: y - dragOffset.y
            };
          }
          return annot;
        });
        
        setAnnotations(updatedAnnotations);
        setSelectedAnnotation({
          ...selectedAnnotation,
          x: x - dragOffset.x,
          y: y - dragOffset.y
        });
      }
    } else if (isDrawing && currentAnnotation) {
      // Add a new point to the current line annotation
      setCurrentAnnotation({
        ...currentAnnotation,
        points: [...currentAnnotation.points, { x, y }]
      });
    }
  };

  // Handle mouse up on interactive board
  const handleBoardMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }
    
    if (isDragging) {
      setIsDragging(false);
    } else if (isDrawing && currentAnnotation) {
      // Finish the current line annotation
      setAnnotations([...annotations, currentAnnotation]);
      setCurrentAnnotation(null);
      setIsDrawing(false);
    }
  };

  // Handle mouse leave on interactive board
  const handleBoardMouseLeave = () => {
    if (isPanning) {
      setIsPanning(false);
    }
    
    if (isDragging) {
      setIsDragging(false);
    } else if (isDrawing) {
      setIsDrawing(false);
      if (currentAnnotation && currentAnnotation.points.length > 1) {
        setAnnotations([...annotations, currentAnnotation]);
      }
      setCurrentAnnotation(null);
    }
  };

  // Handle zoom in
  const handleZoomIn = () => {
    setBoardScale(prev => Math.min(prev * 1.2, boardLimits.maxScale));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setBoardScale(prev => Math.max(prev / 1.2, boardLimits.minScale));
  };

  // Handle reset view (zoom and position)
  const handleResetView = () => {
    setBoardScale(1);
    setBoardPosition({ x: 0, y: 0 });
  };

  // Handle wheel events for zooming
  const handleBoardWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(
        boardLimits.minScale, 
        Math.min(boardLimits.maxScale, boardScale * scaleChange)
      );
      
      // Calculate zoom point
      const boardRect = boardRef.current.getBoundingClientRect();
      const pointX = e.clientX - boardRect.left;
      const pointY = e.clientY - boardRect.top;
      
      // Adjust position to zoom toward mouse position
      const newPosition = {
        x: pointX - (pointX - boardPosition.x) * (newScale / boardScale),
        y: pointY - (pointY - boardPosition.y) * (newScale / boardScale)
      };
      
      // Apply limits to the position
      const limitedPosition = {
        x: Math.max(boardLimits.minX, Math.min(boardLimits.maxX, newPosition.x)),
        y: Math.max(boardLimits.minY, Math.min(boardLimits.maxY, newPosition.y))
      };
      
      setBoardScale(newScale);
      setBoardPosition(limitedPosition);
    }
  };

  // Add product to interactive board
  const addProductToBoard = (product) => {
    // Generate random position within the board
    const newItem = {
      id: product.id,
      type: 'image',
      product,
      x: Math.random() * 600,
      y: Math.random() * 400,
      width: 180,
      height: 180,
      rotation: 0,
      zIndex: interactiveItems.length
    };
    
    setInteractiveItems([...interactiveItems, newItem]);
    setProductDropdownOpen(false);
  };

  // Clear all annotations from the board
  const clearAnnotations = () => {
    setAnnotations([]);
    setSelectedAnnotation(null);
    setIsEditing(false);
  };

  // Color wheel component - updated to match the screenshot
  const ColorWheel = ({ position, onSelectColor }) => {
    const wheelSize = 320;
    
    // Helper to convert HSV to RGB
    const hsvToRgb = (h, s, v) => {
      let r, g, b;
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        default: r = 0; g = 0; b = 0;
      }
      
      return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
      ];
    };
    
    // Helper to convert RGB to Hex
    const rgbToHex = (r, g, b) => {
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    };
    
    // Handle click on the color gradient
    const handleGradientClick = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate hue and saturation based on position
      // Center point to calculate angle (hue) and distance from center (saturation)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Hue is calculated based on angle from center
      let angle = Math.atan2(y - centerY, x - centerX);
      if (angle < 0) angle += 2 * Math.PI;
      const hue = angle / (2 * Math.PI);
      
      // Saturation is based on distance from center (clamped to 1.0)
      const maxDistance = Math.min(centerX, centerY);
      const distance = Math.min(
        Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)),
        maxDistance
      );
      const saturation = distance / maxDistance;
      
      // Convert HSV to RGB (V is fixed at 1.0 for full brightness)
      const [r, g, b] = hsvToRgb(hue, saturation, 1.0);
      const hexColor = rgbToHex(r, g, b);
      
      // Call the callback with the selected color
      onSelectColor(hexColor);
    };
    
    return (
      <div 
        className="color-wheel-container" 
        style={{ 
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${wheelSize}px`,
          height: `${wheelSize + 60}px`, // Extra height for the hex input
          backgroundColor: '#272727',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          zIndex: 10000,
          overflow: 'hidden'
        }}
        ref={colorWheelRef}
      >
        {/* Color gradient area */}
        <div 
          className="color-gradient"
          style={{
            width: '100%',
            height: `${wheelSize}px`,
            borderRadius: '8px 8px 0 0',
            background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
            position: 'relative',
            cursor: 'crosshair',
            backgroundImage: `
              linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%),
              linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)
            `
          }}
          onClick={handleGradientClick}
        >
          {/* White overlay for saturation */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none'
          }} />
        </div>
        
        {/* Hex color input area */}
        <div style={{
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            color: '#fff',
            fontSize: '18px',
            fontFamily: 'monospace'
          }}>
            {hexColor.toUpperCase()}
          </div>
          <div style={{
            width: '30px',
            height: '30px',
            backgroundColor: hexColor,
            border: '1px solid #666',
            borderRadius: '4px'
          }}></div>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#ccc',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onClick={() => onSelectColor(hexColor)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Render view based on current mode
  const renderProductsView = () => {
    if (loading) {
      return <div className="simple-loading">Loading products...</div>;
    }
    
    if (filteredProducts.length === 0) {
      return <div className="simple-no-results">No products match your search</div>;
    }

    switch (viewMode) {
      case 'grid':
        return (
          <div className={`simple-products-grid grid-cols-${gridSize}`}>
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className={`simple-product-item-container ${selectedProducts.includes(product.id) ? 'selected' : ''}`}
              >
                <div 
                  className="simple-product-item"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Selection indicator */}
                  {isSelectionMode && (
                    <div className={`simple-product-selection ${selectedProducts.includes(product.id) ? 'selected' : ''}`}>
                      {selectedProducts.includes(product.id) && 
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="white" />
                        </svg>
                      }
                    </div>
                  )}
                  
                  {/* Product image box */}
                  <div className="simple-product-box">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="simple-product-image"
                    />
                  </div>
                  
                  {/* Product info below image */}
                  <div className="simple-product-info">
                    <div className="simple-product-title">{product.name}</div>
                    <div className="simple-product-subtitle">{product.brand} · ${product.retailPrice}</div>
                    <div className="simple-product-tags">
                      {product.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className={`simple-product-tag ${activeTag === tag ? 'active' : ''}`}
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
          </div>
        );
      
      case 'list':
        return (
          <div className="simple-products-list">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className={`simple-product-list-item ${selectedProducts.includes(product.id) ? 'selected' : ''}`}
                onClick={() => handleProductClick(product)}
              >
                {isSelectionMode && (
                  <div className={`simple-product-selection ${selectedProducts.includes(product.id) ? 'selected' : ''}`}>
                    {selectedProducts.includes(product.id) && 
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="white" />
                      </svg>
                    }
                  </div>
                )}
                <div className="simple-product-list-image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="simple-product-list-info">
                  <div className="simple-product-list-title">{product.name}</div>
                  <div className="simple-product-list-details">
                    {product.brand} · ${product.retailPrice} · {product.colorway}
                  </div>
                  <div className="simple-product-tags">
                    {product.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className={`simple-product-tag ${activeTag === tag ? 'active' : ''}`}
                        onClick={(e) => handleTagClick(tag, e)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'interactive':
        return (
          <div className="simple-interactive-container">
            {/* Interactive board toolbar */}
            <div className="simple-interactive-toolbar">
              <div className="simple-interactive-tools">
                {/* Products dropdown button */}
                <div className="simple-tool-dropdown" ref={productButtonRef}>
                  <button 
                    className={`simple-tool-btn ${productDropdownOpen ? 'active' : ''}`}
                    onClick={toggleProductDropdown}
                    title="Add Products"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  
                  {productDropdownOpen && (
                    <div className="simple-products-dropdown">
                      <div className="simple-dropdown-title">Add Products</div>
                      <div className="simple-dropdown-products">
                        {filteredProducts.slice(0, 6).map(product => (
                          <div 
                            key={product.id}
                            className="simple-dropdown-product"
                            onClick={() => addProductToBoard(product)}
                          >
                            <img src={product.imageUrl} alt={product.name} />
                            <div className="simple-dropdown-product-name">{product.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="simple-tool-divider"></div>

                {/* Select tool */}
                <button 
                  className={`simple-tool-btn ${activeTool === 'select' ? 'active' : ''}`}
                  onClick={() => handleToolChange('select')}
                  title="Select Tool"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2l6 6-12 12-6-6 12-12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Marker tool with color dropdown */}
                <div className="simple-tool-dropdown" ref={toolsRefs.marker}>
                  <button 
                    className={`simple-tool-btn ${activeTool === 'marker' ? 'active' : ''}`}
                    onClick={() => handleToolChange('marker')}
                    title="Marker Tool"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div 
                      className="simple-color-indicator"
                      style={{ background: selectedColor }}
                      onClick={(e) => openColorWheel(e, 'marker')}
                    ></div>
                  </button>
                </div>
                
                {/* Highlighter tool with color dropdown */}
                <div className="simple-tool-dropdown" ref={toolsRefs.highlighter}>
                  <button 
                    className={`simple-tool-btn ${activeTool === 'highlighter' ? 'active' : ''}`}
                    onClick={() => handleToolChange('highlighter')}
                    title="Highlighter Tool"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 3l9 9-7 7-9-9V3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 10l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div 
                      className="simple-color-indicator"
                      style={{ background: selectedColor }}
                      onClick={(e) => openColorWheel(e, 'highlighter')}
                    ></div>
                  </button>
                </div>
                
                {/* Comment tool */}
                <button 
                  className={`simple-tool-btn ${activeTool === 'comment' ? 'active' : ''}`}
                  onClick={() => handleToolChange('comment')}
                  title="Add Comment"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Tag tool */}
                <button 
                  className={`simple-tool-btn ${activeTool === 'tag' ? 'active' : ''}`}
                  onClick={() => handleToolChange('tag')}
                  title="Add Tag"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
                
                {/* Text tool with color dropdown */}
                <div className="simple-tool-dropdown" ref={toolsRefs.text}>
                  <button 
                    className={`simple-tool-btn ${activeTool === 'text' ? 'active' : ''}`}
                    onClick={() => handleToolChange('text')}
                    title="Add Text"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6h16M12 6v12M7 19h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div 
                      className="simple-color-indicator"
                      style={{ background: selectedColor }}
                      onClick={(e) => openColorWheel(e, 'text')}
                    ></div>
                  </button>
                </div>
                
                <div className="simple-tool-divider"></div>
                
                {/* Clear button */}
                <button 
                  className="simple-tool-btn"
                  onClick={clearAnnotations}
                  title="Clear Annotations"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Delete button for selected annotation */}
                <button 
                  className={`simple-tool-btn ${selectedAnnotation ? 'active' : ''}`}
                  onClick={deleteSelectedAnnotation}
                  title="Delete Selected"
                  disabled={!selectedAnnotation}
                  style={{ opacity: selectedAnnotation ? 0.7 : 0.3 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-3 0v14M9 6v14m8-14l-1 14M6 6l1 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <div className="simple-tool-divider"></div>
                
                {/* Dark/Light mode toggle */}
                <button 
                  className="simple-mode-toggle"
                  onClick={toggleDarkMode}
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDarkMode ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16a4 4 0 100-8 4 4 0 000 8z" fill="currentColor"/>
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" fill="currentColor"/>
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="simple-interactive-actions">
                {/* Send button */}
                <button className="simple-action-btn" title="Send">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Download button */}
                <button className="simple-action-btn" onClick={handleDownload} title="Download">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Active users */}
                <div className="simple-active-users">
                  {activeUsers.map(user => (
                    <div 
                      key={user.id} 
                      className="simple-user-dot" 
                      style={{ backgroundColor: user.color }}
                      title={user.name}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main interactive board with infinite grid */}
            <div 
              className={`simple-interactive-board ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
              ref={boardRef}
              onMouseDown={handleBoardMouseDown}
              onMouseMove={handleBoardMouseMove}
              onMouseUp={handleBoardMouseUp}
              onMouseLeave={handleBoardMouseLeave}
              onKeyDown={handleKeyDown}
              onWheel={handleBoardWheel}
              tabIndex={0}
              style={{
                cursor: isPanning ? 'grabbing' : (activeTool === 'select' ? 'default' : 'crosshair'),
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Infinite grid background */}
              <div className="simple-board-grid" style={{
                transform: `translate(${boardPosition.x}px, ${boardPosition.y}px) scale(${boardScale})`,
                width: '10000px', 
                height: '10000px',
                left: '-5000px',
                top: '-5000px'
              }}></div>
              
              {/* Interactive items (product images) with zoom handling */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transform: `translate(${boardPosition.x}px, ${boardPosition.y}px) scale(${boardScale})`,
                transformOrigin: '0 0'
              }}>
                {interactiveItems.map(item => (
                  <div
                    key={item.id}
                    className={`simple-board-item ${selectedInteractiveItem && selectedInteractiveItem.id === item.id ? 'selected' : ''}`}
                    style={{
                      left: `${item.x}px`,
                      top: `${item.y}px`,
                      width: `${item.width}px`,
                      height: `${item.height}px`,
                      transform: `rotate(${item.rotation}deg)`,
                      zIndex: item.zIndex
                    }}
                  >
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      draggable="false"
                    />
                    <div className="simple-board-item-label">
                      {item.product.name}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Annotations container (on top of products) */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transform: `translate(${boardPosition.x}px, ${boardPosition.y}px) scale(${boardScale})`,
                  transformOrigin: '0 0',
                  pointerEvents: 'none',
                  zIndex: 1000 // Make sure annotations are on top
                }}
              >
                {/* Annotations (lines, notes, tags, text) */}
                {annotations.map(annotation => {
                  if (annotation.type === 'line') {
                    // Render line annotation
                    const pathData = annotation.points.reduce((path, point, index) => {
                      return index === 0 
                        ? `M ${point.x} ${point.y}` 
                        : `${path} L ${point.x} ${point.y}`;
                    }, '');
                    
                    return (
                      <svg 
                        key={annotation.id}
                        className="simple-annotation-svg"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
                      >
                        <path 
                          d={pathData} 
                          stroke={annotation.color} 
                          strokeWidth={annotation.strokeWidth} 
                          fill="none"
                          opacity={annotation.opacity || 1}
                        />
                      </svg>
                    );
                  } else if (annotation.type === 'note') {
                    // Render note/comment annotation
                    const isSelected = selectedAnnotation && selectedAnnotation.id === annotation.id;
                    return (
                      <div
                        key={annotation.id}
                        className={`simple-annotation-note ${isSelected ? 'selected' : ''}`}
                        style={{
                          position: 'absolute',
                          left: `${annotation.x}px`,
                          top: `${annotation.y}px`,
                          width: `${annotation.width}px`,
                          height: `${annotation.height}px`,
                          backgroundColor: annotation.color,
                          color: annotation.textColor || '#000',
                          padding: '8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: activeTool === 'select' ? 'move' : 'default',
                          boxShadow: isSelected ? '0 0 0 2px #47956f' : 'none',
                          overflow: 'auto',
                          pointerEvents: 'auto', // Enable interaction
                          zIndex: isSelected ? 1001 : 1000 // Ensure selected items are on top
                        }}
                        onClick={(e) => {
                          if (activeTool === 'select') {
                            e.stopPropagation();
                            setSelectedAnnotation(annotation);
                            setSelectedInteractiveItem(null);
                          }
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          startEditing(annotation);
                        }}
                      >
                        {isEditing && isSelected ? (
                          <textarea
                            ref={editInputRef}
                            value={editText}
                            onChange={handleEditChange}
                            onKeyDown={handleKeyDown}
                            style={{
                              width: '100%',
                              height: '100%',
                              background: 'none',
                              border: 'none',
                              color: annotation.textColor,
                              fontSize: '12px',
                              fontFamily: 'inherit',
                              resize: 'none',
                              outline: 'none'
                            }}
                            autoFocus
                          />
                        ) : (
                          annotation.text
                        )}
                      </div>
                    );
                  } else if (annotation.type === 'tag') {
                    // Render tag annotation
                    const isSelected = selectedAnnotation && selectedAnnotation.id === annotation.id;
                    return (
                      <div
                        key={annotation.id}
                        className={`simple-annotation-tag ${isSelected ? 'selected' : ''}`}
                        style={{
                          position: 'absolute',
                          left: `${annotation.x}px`,
                          top: `${annotation.y}px`,
                          backgroundColor: annotation.color,
                          color: annotation.textColor || '#000',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          userSelect: 'none',
                          cursor: activeTool === 'select' ? 'move' : 'default',
                          boxShadow: isSelected ? '0 0 0 2px #47956f' : 'none',
                          pointerEvents: 'auto', // Enable interaction
                          zIndex: isSelected ? 1001 : 1000 // Ensure selected items are on top
                        }}
                        onClick={(e) => {
                          if (activeTool === 'select') {
                            e.stopPropagation();
                            setSelectedAnnotation(annotation);
                            setSelectedInteractiveItem(null);
                          }
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          startEditing(annotation);
                        }}
                      >
                        {isEditing && isSelected ? (
                          <input
                            ref={editInputRef}
                            value={editText}
                            onChange={handleEditChange}
                            onKeyDown={handleKeyDown}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: annotation.textColor,
                              fontSize: '12px',
                              fontFamily: 'inherit',
                              width: `${editText.length * 8 + 10}px`,
                              outline: 'none'
                            }}
                            autoFocus
                          />
                        ) : (
                          annotation.text
                        )}
                      </div>
                    );
                  } else if (annotation.type === 'text') {
                    // Render text annotation
                    const isSelected = selectedAnnotation && selectedAnnotation.id === annotation.id;
                    return (
                      <div
                        key={annotation.id}
                        className={`simple-annotation-text ${isSelected ? 'selected' : ''}`}
                        style={{
                          position: 'absolute',
                          left: `${annotation.x}px`,
                          top: `${annotation.y}px`,
                          color: annotation.color,
                          fontSize: `${annotation.fontSize}px`,
                          fontWeight: 'bold',
                          userSelect: 'none',
                          cursor: activeTool === 'select' ? 'move' : 'default',
                          padding: '2px',
                          borderRadius: '2px',
                          backgroundColor: isSelected ? 'rgba(71, 149, 111, 0.2)' : 'transparent',
                          pointerEvents: 'auto', // Enable interaction
                          zIndex: isSelected ? 1001 : 1000 // Ensure selected items are on top
                        }}
                        onClick={(e) => {
                          if (activeTool === 'select') {
                            e.stopPropagation();
                            setSelectedAnnotation(annotation);
                            setSelectedInteractiveItem(null);
                          }
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          startEditing(annotation);
                        }}
                      >
                        {isEditing && isSelected ? (
                          <input
                            ref={editInputRef}
                            value={editText}
                            onChange={handleEditChange}
                            onKeyDown={handleKeyDown}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: annotation.color,
                              fontSize: `${annotation.fontSize}px`,
                              fontWeight: 'bold',
                              width: `${editText.length * annotation.fontSize * 0.6 + 10}px`,
                              outline: 'none'
                            }}
                            autoFocus
                          />
                        ) : (
                          annotation.text
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
                
                {/* Current annotation being drawn */}
                {currentAnnotation && currentAnnotation.type === 'line' && (
                  <svg 
                    className="simple-annotation-svg"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
                  >
                    <path 
                      d={currentAnnotation.points.reduce((path, point, index) => {
                        return index === 0 
                          ? `M ${point.x} ${point.y}` 
                          : `${path} L ${point.x} ${point.y}`;
                      }, '')} 
                      stroke={currentAnnotation.color} 
                      strokeWidth={currentAnnotation.strokeWidth} 
                      fill="none"
                      opacity={currentAnnotation.opacity || 1}
                    />
                  </svg>
                )}
              </div>
              
              {/* Navigation controls - fixed position */}
              <div className="simple-board-navigation">
                <button 
                  className="simple-nav-btn zoom-in" 
                  onClick={handleZoomIn} 
                  title="Zoom In"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button 
                  className="simple-nav-btn zoom-out" 
                  onClick={handleZoomOut} 
                  title="Zoom Out"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button 
                  className="simple-nav-btn reset-view" 
                  onClick={handleResetView} 
                  title="Reset View"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h18v18H3V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 8h8v8H8V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Updated Color wheel component */}
            {colorWheelOpen && (
              <ColorWheel 
                position={colorWheelPosition} 
                onSelectColor={handleColorSelect} 
              />
            )}
          </div>
        );
      
      default:
        return (
          <div className="simple-products-grid grid-cols-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="simple-product-item-container"
              >
                <div 
                  className="simple-product-item"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Product image box */}
                  <div className="simple-product-box">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="simple-product-image"
                    />
                  </div>
                  
                  {/* Product info below image */}
                  <div className="simple-product-info">
                    <div className="simple-product-title">{product.name}</div>
                    <div className="simple-product-subtitle">{product.brand} · ${product.retailPrice}</div>
                    <div className="simple-product-tags">
                      {product.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className={`simple-product-tag ${activeTag === tag ? 'active' : ''}`}
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
          </div>
        );
    }
  };

  return (
    <div className="simple-folders-page">
      {/* Header with logo and search - same as SimpleFoldersPage */}
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
            placeholder="search products, tags, content..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          
          {/* Sort dropdown button with ref for positioning */}
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
          {/* ProfileDropdown component only - removed the "^" button */}
          <ProfileDropdown />
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
          <div 
            className={`simple-sort-option ${sortOption === 'price-asc' ? 'active' : ''}`} 
            onClick={() => handleSortChange('price-asc')}
          >
            Price: Low to High
          </div>
          <div 
            className={`simple-sort-option ${sortOption === 'price-desc' ? 'active' : ''}`} 
            onClick={() => handleSortChange('price-desc')}
          >
            Price: High to Low
          </div>
        </div>
      )}
      
      {/* Folder info and navigation */}
      <div className="simple-folder-header">
        <div className="simple-back-button" onClick={() => onBack && onBack()}>
          ← Back to Folders
        </div>
        
        <div className="simple-folder-title-container">
          <h1 className="simple-folder-main-title">:{folder?.name || 'Folder'}</h1>
          {folder?.tags && (
            <div className="simple-folder-tags-list">
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
          )}
        </div>
      </div>
      
      {/* Grid controls row with view options and action buttons */}
      <div className="simple-grid-controls">
        {/* View mode toggle */}
        <div className="simple-view-toggle" ref={viewButtonRef}>
          <button 
            className="simple-view-button"
            onClick={toggleViewDropdown}
          >
            {viewMode}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '5px'}}>
              <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {viewDropdownOpen && (
            <div className="simple-view-dropdown">
              <div 
                className={`simple-view-option ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('grid')}
              >
                Grid
              </div>
              <div 
                className={`simple-view-option ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('list')}
              >
                List
              </div>
              <div 
                className={`simple-view-option ${viewMode === 'interactive' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('interactive')}
              >
                Interactive
              </div>
            </div>
          )}
        </div>
        
        {/* Grid size slider - only visible in grid view */}
        {viewMode === 'grid' && (
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
        )}
        
        {/* Action buttons */}
        <div className="simple-action-buttons">
          {/* Select button */}
          <button 
            className={`simple-action-btn ${isSelectionMode ? 'active' : ''}`}
            onClick={toggleSelectionMode}
            title={isSelectionMode ? "Cancel selection" : "Select items"}
          >
            {isSelectionMode ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>

          {/* Download button */}
          <button 
            className="simple-action-btn"
            onClick={handleDownload}
            title="Download"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16l-4-4h2.5V7h3v5H16l-4 4z" fill="currentColor"/>
              <path d="M5 21v-2h14v2H5z" fill="currentColor"/>
            </svg>
          </button>
          
          {/* Share button */}
          <button 
            className="simple-action-btn"
            onClick={handleShare}
            title="Share"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 13l6 3M15 8l-6 3" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          
          {/* User button */}
          <button 
            className="simple-action-btn"
            onClick={handleViewUsers}
            title="Shared users"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 21c0-4.418-3.582-8-8-8s-8 3.582-8 8" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
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
      
      {/* Products container with white border */}
      <div className="simple-products-container">
        {/* Products grid or other view mode */}
        {renderProductsView()}
      </div>
    </div>
  );
};

export default FolderContentsPage;