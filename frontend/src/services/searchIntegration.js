// frontend/src/services/searchIntegration.js
import axios from 'axios';

// Main search function that coordinates searches across different sources
export async function searchSneakers(searchTerm, filters = {}) {
  console.log('Search term:', searchTerm);
  console.log('Filters:', filters);
  
  try {
    // Get the API URL from environment variables or use a default
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    const endpoint = `${apiUrl}/api/search/kicksdb`;
    
    console.log(`Sending request to: ${endpoint}`);
    
    // Make the API request with proper parameters
    const response = await axios.get(endpoint, {
      params: {
        query: searchTerm,
        limit: 50,
        sort: 'release_date',
        ...filters // Include any additional filters
      }
    });
    
    // Check if we got a successful response with data
    if (response.data && response.data.status === 'success' && response.data.data) {
      console.log('KicksDB API returned successful response');
      
      // Format the data from KicksDB to match our app's structure
      const formattedResults = formatSneakerData(response.data.data?.data || []);
      
      return {
        results: formattedResults,
        source: 'kicksdb',
        total: response.data.data?.meta?.total || formattedResults.length
      };
    } else {
      console.warn('Unexpected response format from KicksDB:', response.data);
      return {
        results: [],
        source: 'kicksdb',
        error: 'Invalid response format'
      };
    }
  } catch (error) {
    console.error('Error in searchSneakers:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    return {
      results: [],
      source: 'error',
      error: error.response?.data?.message || error.message
    };
  }
}

// Format sneaker data to a consistent structure
export function formatSneakerData(sneakers) {
  if (!sneakers || !Array.isArray(sneakers)) {
    console.warn('Invalid sneakers data:', sneakers);
    return [];
  }
  
  return sneakers.map(sneaker => {
    // Return a normalized sneaker object
    const formattedSneaker = {
      id: sneaker.id || sneaker.uuid || `sneaker-${Math.random().toString(36).substring(2, 10)}`,
      name: sneaker.name || sneaker.title || 'Unknown Sneaker',
      brand: sneaker.brand || 'Unknown Brand',
      model: sneaker.model || '',
      colorway: sneaker.colorway || sneaker.color || '',
      releaseDate: sneaker.releaseDate || sneaker.release_date || '',
      retailPrice: sneaker.retailPrice || sneaker.retail_price || '',
      description: sneaker.description || '',
      imageUrl: sneaker.image || sneaker.imageUrl || sneaker.image_url || sneaker.thumbnail_url || 'https://via.placeholder.com/300x300/eeeeee/333333?text=No+Image',
      tags: sneaker.tags || [],
      subtitle: sneaker.subtitle || `[${sneaker.style_id || ''}${sneaker.colorway ? '/' + sneaker.colorway : ''}]`,
      source: 'kicksdb',
      
      // Additional fields that might be present in some sources
      sku: sneaker.sku || sneaker.style_id || '',
      gender: sneaker.gender || '',
      category: sneaker.category || '',
      material: sneaker.material || sneaker.materials || [],
      
      // Market data if available
      market: sneaker.market_data || null
    };
    console.log('Formatted Sneaker:', formattedSneaker);
    return formattedSneaker;
  });
}

// Create a service object to export
const searchIntegrationService = {
  searchSneakers,
  formatSneakerData
};

// Export the service object as default
export default searchIntegrationService;
