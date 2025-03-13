// frontend/src/services/kaggleDataService.js
import { saveSneakerToFirebase } from './firebaseDataService';

// Function to fetch sneaker images from Kaggle dataset
export async function fetchKaggleSneakerImages(searchTerm, limit = 20) {
  try {
    console.log('Fetching sneaker images from Kaggle dataset for:', searchTerm);
    
    // For local development without direct Kaggle API access,
    // we'll use a proxy endpoint on our backend
    const response = await fetch(`/api/kaggle/sneakers?query=${encodeURIComponent(searchTerm)}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Kaggle API error: ${response.status}`);
    }
    
    const data = await response.json();
    return processSneakerImages(data, searchTerm);
  } catch (error) {
    console.error('Error fetching Kaggle data:', error);
    return [];
  }
}

// Process the images into our standard sneaker format
function processSneakerImages(imageData, searchTerm) {
  if (!imageData || !Array.isArray(imageData.images)) {
    return [];
  }
  
  return imageData.images.map(image => {
    // Extract useful information from image filename
    // Filenames are like: clean_2019-01-21_19-18-49_UTC.jpg
    const filename = image.filename || '';
    const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
    const releaseYear = dateMatch ? dateMatch[1].substring(0, 4) : new Date().getFullYear();
    
    // Create tags from the search term
    const tags = generateTagsFromSearchTerm(searchTerm);
    
    // Detect brand from the search term
    const brand = detectBrandFromSearchTerm(searchTerm);
    
    // Create a unique ID for this sneaker
    const uniqueId = `kaggle_${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      id: uniqueId,
      name: formatNameFromSearchTerm(searchTerm),
      colorway: detectColorwayFromSearchTerm(searchTerm) || 'Unknown Colorway',
      brand: brand || 'Unknown Brand',
      imageUrl: image.url,
      releaseYear: parseInt(releaseYear),
      material: [],
      gender: '',
      age: '',
      tags: tags,
      source: 'kaggle'
    };
  });
}

// Helper functions to extract information from search terms
function formatNameFromSearchTerm(searchTerm) {
  // Capitalize the search term appropriately for a product name
  return searchTerm
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function detectBrandFromSearchTerm(searchTerm) {
  const searchLower = searchTerm.toLowerCase();
  const brands = {
    'nike': 'Nike',
    'jordan': 'Jordan',
    'adidas': 'Adidas',
    'yeezy': 'Adidas',
    'reebok': 'Reebok',
    'new balance': 'New Balance',
    'puma': 'Puma',
    'vans': 'Vans',
    'converse': 'Converse',
    'asics': 'Asics'
  };
  
  for (const [keyword, brandName] of Object.entries(brands)) {
    if (searchLower.includes(keyword)) {
      return brandName;
    }
  }
  
  return null;
}

function detectColorwayFromSearchTerm(searchTerm) {
  const searchLower = searchTerm.toLowerCase();
  const colors = [
    'black', 'white', 'red', 'blue', 'green', 'yellow', 
    'purple', 'pink', 'orange', 'brown', 'grey', 'gray',
    'mocha', 'olive', 'navy', 'teal', 'gold', 'silver'
  ];
  
  for (const color of colors) {
    if (searchLower.includes(color)) {
      return color.charAt(0).toUpperCase() + color.slice(1);
    }
  }
  
  return null;
}

function generateTagsFromSearchTerm(searchTerm) {
  const tags = [];
  const words = searchTerm.toLowerCase().split(' ');
  
  // Add each word as a tag
  words.forEach(word => {
    if (word.length > 2) {
      tags.push(word);
    }
  });
  
  return tags;
}

// Function to save Kaggle results to Firebase
export async function saveKaggleResultsToFirebase(sneakers) {
  const savedSneakers = [];
  
  for (const sneaker of sneakers) {
    try {
      const savedSneaker = await saveSneakerToFirebase({
        ...sneaker,
        source: 'kaggle'
      });
      savedSneakers.push(savedSneaker);
    } catch (error) {
      console.error('Error saving Kaggle sneaker to Firebase:', error);
    }
  }
  
  return savedSneakers;
}

export default {
  fetchKaggleSneakerImages,
  saveKaggleResultsToFirebase
};