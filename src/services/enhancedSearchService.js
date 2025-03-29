// frontend/src/services/enhancedSearchService.js
import { searchSneakersFromFirebase, saveSneakerToFirebase } from './firebaseDataService';
import { performGoogleSearch, extractAndSaveSneakerData } from './googleSearchService';

// Sample data for fallback if Firebase search fails
const sampleSneakers = [
  // ... your existing sample data ...
];

// Main search function
export async function comprehensiveSearch(searchTerm, filters = {}) {
  try {
    console.log('Searching for:', searchTerm, 'with filters:', filters);
    
    let results = [];
    let source = 'sample';
    
    // First try to search from Firebase
    try {
      console.log('Attempting to search from Firebase...');
      results = await searchSneakersFromFirebase(searchTerm, filters);
      source = 'firebase';
      
      // If we got results from Firebase, return them
      if (results && results.length > 0) {
        console.log('Using Firebase results:', results.length);
        return {
          results,
          source
        };
      }
    } catch (firebaseError) {
      console.error('Firebase search failed:', firebaseError);
      // Continue to fallback options
    }
    
    // If no results from Firebase, try Google search if search term provided
    if (searchTerm && searchTerm.trim() !== '') {
      try {
        console.log('No Firebase results, trying Google search...');
        const searchResults = await performGoogleSearch(searchTerm);
        
        if (searchResults && searchResults.length > 0) {
          console.log('Google search returned results, processing...');
          
          // Process Google search results
          const processedResults = await extractAndSaveSneakerData(searchResults);
          
          // Save each result to Firebase for future searches
          for (const sneaker of processedResults) {
            try {
              await saveSneakerToFirebase(sneaker);
            } catch (saveError) {
              console.error('Error saving sneaker to Firebase:', saveError);
              // Continue with next sneaker
            }
          }
          
          // Filter the processed results based on provided filters
          const filteredResults = applyFilters(processedResults, filters);
          
          console.log('Using Google search results:', filteredResults.length);
          return {
            results: filteredResults,
            source: 'google'
          };
        }
      } catch (googleError) {
        console.error('Google search failed:', googleError);
        // Continue to fallback options
      }
    }
    
    // If both Firebase and Google search failed or returned no results, use sample data
    console.log('Using sample data as fallback');
    results = [...sampleSneakers];
    
    // Filter by search term if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(sneaker => 
        sneaker.name.toLowerCase().includes(term) || 
        sneaker.colorway.toLowerCase().includes(term) ||
        sneaker.brand.toLowerCase().includes(term)
      );
    }
    
    // Apply all filters
    results = applyFilters(results, filters);
    
    return {
      results,
      source: 'sample'
    };
  } catch (error) {
    console.error('Error in search:', error);
    return {
      results: [],
      source: 'error',
      error: error.message
    };
  }
}

// Apply multiple filters to results (keep your existing function)
function applyFilters(results, filters) {
  // Your existing filter function
  if (!results || !Array.isArray(results)) return [];
  if (!filters || Object.keys(filters).length === 0) return results;
  
  return results.filter(sneaker => {
    // Brand filter
    if (filters.brand && sneaker.brand) {
      if (sneaker.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }
    }
    
    // Color filter
    if (filters.color && sneaker.colorway) {
      if (!sneaker.colorway.toLowerCase().includes(filters.color.toLowerCase())) {
        return false;
      }
    }
    
    // Gender filter
    if (filters.gender && sneaker.gender) {
      if (sneaker.gender.toLowerCase() !== filters.gender.toLowerCase()) {
        return false;
      }
    }
    
    // Age filter
    if (filters.age && sneaker.age) {
      if (sneaker.age.toLowerCase() !== filters.age.toLowerCase()) {
        return false;
      }
    }
    
    // Material filter
    if (filters.material && filters.material.length > 0 && sneaker.material) {
      if (!filters.material.some(material => 
        sneaker.material.includes(material)
      )) {
        return false;
      }
    }
    
    // Price filter
    if (filters.price) {
      if (filters.price.min && sneaker.price < filters.price.min) {
        return false;
      }
      if (filters.price.max && sneaker.price > filters.price.max) {
        return false;
      }
    }
    
    return true;
  });
}

export default {
  comprehensiveSearch
};