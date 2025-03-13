// frontend/src/services/searchIntegration.js
import { searchSneakersFromFirebase } from './firebaseDataService';
import { searchSneakersFromAPI } from './sneakersApiService';
import { comprehensiveSearch } from './combinedSearchService';

// This function adapts your existing search services to work with the Figma UI
export async function searchSneakers(searchTerm, filters = {}) {
  try {
    console.log('Search integration: searching for', searchTerm, 'with filters:', filters);
    
    // CHANGED: Try SneakersAPI first instead of Firebase
    try {
      console.log('Attempting SneakersAPI search first...');
      const apiResults = await searchSneakersFromAPI(searchTerm);
      
      if (apiResults && apiResults.length > 0) {
        console.log('SneakersAPI search successful with', apiResults.length, 'results');
        // Format the results to ensure consistent data structure
        const formattedResults = apiResults.map(sneaker => formatSneakerData(sneaker));
        return {
          results: formattedResults,
          source: 'sneakersapi'
        };
      } else {
        console.log('SneakersAPI returned no results, falling back to Firebase');
      }
    } catch (apiError) {
      console.error('SneakersAPI search failed, falling back to Firebase:', apiError);
    }
    
    // Now try Firebase as fallback
    try {
      console.log('Attempting Firebase search as fallback...');
      const firebaseResults = await searchSneakersFromFirebase(searchTerm, filters);
      
      if (firebaseResults && firebaseResults.length > 0) {
        console.log('Firebase search successful with', firebaseResults.length, 'results');
        const formattedResults = firebaseResults.map(sneaker => formatSneakerData(sneaker));
        return {
          results: formattedResults,
          source: 'firebase'
        };
      }
    } catch (firebaseError) {
      console.error('Firebase search also failed:', firebaseError);
    }
    
    // If all direct searches fail, fall back to combined search
    console.log('Direct searches failed, using comprehensive search...');
    const searchResults = await comprehensiveSearch(searchTerm, filters);
    
    // Format the results to ensure consistent data structure
    const formattedResults = (searchResults.results || []).map(sneaker => formatSneakerData(sneaker));
    
    return {
      results: formattedResults,
      source: searchResults.source || 'combined'
    };
  } catch (error) {
    console.error('Search integration error:', error);
    return {
      results: [],
      source: 'error',
      error: error.message
    };
  }
}

// Format the data to ensure consistent structure for the UI (keep your existing function)
export function formatSneakerData(sneaker) {
  // Extract the best image URL from various possible locations
  let imageUrl = sneaker.imageUrl;
  if (!imageUrl && sneaker.images && sneaker.images.length > 0) {
    imageUrl = sneaker.images[0].url || sneaker.images[0];
  }
  if (!imageUrl && sneaker.pagemap?.cse_image?.[0]?.src) {
    imageUrl = sneaker.pagemap.cse_image[0].src;
  }
  
  // Extract colorway from various possible locations
  let colorway = sneaker.colorway;
  if (!colorway && sneaker.description) {
    // Try to extract colorway from description
    const colorPatterns = [
      /colorway[:| ]\s*(.+?)(?=\s*\b(size|sz|price)\b|\s*$)/i,
      /colors?[:| ]\s*(.+?)(?=\s*\b(size|sz|price)\b|\s*$)/i,
      /\b(black|white|red|blue|green|yellow|brown|mocha|grey|gray|purple|pink|orange)\b/i
    ];
    
    for (const pattern of colorPatterns) {
      const match = sneaker.description?.match(pattern);
      if (match && match[1]) {
        colorway = match[1].trim();
        break;
      }
    }
  }
  
  // Create subtitle field based on colorway for consistent display
  const subtitle = sneaker.subtitle || (colorway ? `[${colorway}]` : '');
  
  // Create tags if they don't exist
  let tags = sneaker.tags || [];
  if ((!tags || tags.length === 0) && sneaker.brand) {
    tags.push(sneaker.brand.toLowerCase());
    
    // Add colorway-related tags if available
    if (colorway) {
      const colors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'brown', 'mocha', 'grey', 'gray', 'purple', 'pink', 'orange'];
      colors.forEach(color => {
        if (colorway.toLowerCase().includes(color)) {
          tags.push(color);
        }
      });
    }
  }
  
  return {
    id: sneaker.id || `sneaker-${Math.random().toString(36).substr(2, 9)}`,
    name: sneaker.name || sneaker.title || 'Unknown Sneaker',
    colorway: colorway || 'Unknown Colorway',
    brand: sneaker.brand || 'Unknown Brand',
    imageUrl: imageUrl || 'https://via.placeholder.com/300?text=No+Image',
    releaseYear: sneaker.releaseYear || (sneaker.releaseDate ? new Date(sneaker.releaseDate).getFullYear() : new Date().getFullYear()),
    price: sneaker.price || null,
    material: sneaker.material || [],
    gender: sneaker.gender || '',
    age: sneaker.age || '',
    tags: tags,
    subtitle: subtitle, // Added for UI consistency
    source: sneaker.source || 'unknown' // Track source for debugging
  };
}

export default {
  searchSneakers,
  formatSneakerData
};