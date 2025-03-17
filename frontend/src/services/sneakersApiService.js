// frontend/src/services/sneakersApiService.js
import { saveSneakerToFirebase } from './firebaseDataService';

// Function to search sneakers from the SneakersAPI
export async function searchSneakersFromAPI(query, limit = 20) {
  try {
    console.log('Searching SneakersAPI.dev for:', query);
    
    // We'll use our backend as a proxy to protect our API key
    const response = await fetch(`/api/sneakers/search?query=${encodeURIComponent(query)}&limit=${limit}&includeMarketData=true&sort=relevance`);    
    if (!response.ok) {
      throw new Error(`SneakersAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    return processSneakerResults(data.results || [], query);
  } catch (error) {
    console.error('Error searching SneakersAPI:', error);
    return [];
  }
}

// Process the API results into our standard format
function processSneakerResults(results, searchTerm) {
  if (!results || !Array.isArray(results) || results.length === 0) {
    return [];
  }
  
  return results.map(sneaker => {
    return {
      id: sneaker.id || `sneakers-api-${Math.random().toString(36).substring(2, 15)}`,
      name: sneaker.name || 'Unknown Sneaker',
      colorway: sneaker.colorway || 'Unknown Colorway',
      brand: sneaker.brand || 'Unknown Brand',
      imageUrl: sneaker.imageUrl || 'https://via.placeholder.com/300?text=No+Image',
      releaseYear: sneaker.releaseYear || new Date().getFullYear(),
      material: sneaker.material || [],
      gender: sneaker.gender || '',
      age: sneaker.age || '',
      price: sneaker.retailPrice || null,
      description: sneaker.description || '',
      tags: sneaker.tags || [],
      source: 'sneakersapi',
      subtitle: `[${sneaker.colorway || 'Unknown Colorway'}]`
    };
  });
}

// Function to save sneakers to Firebase for future searches
export async function saveSneakersToFirebase(sneakers) {
  const savedSneakers = [];
  
  for (const sneaker of sneakers) {
    try {
      const savedSneaker = await saveSneakerToFirebase(sneaker);
      savedSneakers.push(savedSneaker);
    } catch (error) {
      console.error('Error saving sneaker to Firebase:', error);
    }
  }
  
  return savedSneakers;
}

export default {
  searchSneakersFromAPI,
  saveSneakersToFirebase
};