// frontend/src/services/combinedSearchService.js
import { performGoogleSearch, extractAndSaveSneakerData } from './googleSearchService';
import { searchSneakersFromAPI, saveSneakersToFirebase } from './sneakersApiService';
import { searchSneakersFromFirebase } from './firebaseDataService';

// Main search function
export async function comprehensiveSearch(searchTerm, filters = {}) {
  try {
    console.log('Comprehensive search for:', searchTerm, 'with filters:', filters);
    let allResults = [];
    let resultSource = 'combined';
    
    // Step 1: CHANGED - Search SneakersAPI.dev FIRST
    console.log('Searching SneakersAPI.dev FIRST...');
    const apiResults = await searchSneakersFromAPI(searchTerm);
    console.log('SneakersAPI search results:', apiResults.length);
    
    // Add API results to our results list
    if (apiResults && apiResults.length > 0) {
      console.log('Using SneakersAPI results as primary source');
      allResults = [...allResults, ...apiResults];
      resultSource = 'sneakersapi';
      
      // Save SneakersAPI results to Firebase for future searches
      console.log('Saving SneakersAPI results to Firebase...');
      await saveSneakersToFirebase(apiResults);
    }
    
    // Step 2: Only use Firebase if we need more results
    if (allResults.length < 5) {
      console.log('Not enough results, checking Firebase...');
      const firebaseResults = await searchSneakersFromFirebase(searchTerm, filters);
      
      if (firebaseResults && firebaseResults.length > 0) {
        console.log('Found additional results in Firebase:', firebaseResults.length);
        allResults = [...allResults, ...firebaseResults];
        if (resultSource === 'combined') resultSource = 'firebase';
      }
    }
    
    // Step 3: If we still need more results, use Google search
    if (allResults.length < 3) {
      console.log('Still not enough results, searching with Google...');
      const searchResults = await performGoogleSearch(searchTerm);
      const processedResults = await extractAndSaveSneakerData(searchResults);
      console.log('Google search results:', processedResults.length);
      
      allResults = [...allResults, ...processedResults];
      if (resultSource === 'combined') resultSource = 'google';
    }
    
    // Filter the results based on provided filters
    const filteredResults = applyFilters(allResults, filters);
    console.log('After filtering:', filteredResults.length);
    
    return {
      results: filteredResults,
      source: resultSource
    };
  } catch (error) {
    console.error('Error in comprehensive search:', error);
    return {
      results: [],
      source: 'error',
      error: error.message
    };
  }
}

// Apply filters to results - your existing function
function applyFilters(results, filters) {
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
    if (filters.color && sneaker.tags) {
      if (!sneaker.tags.some(tag => tag.toLowerCase().includes(filters.color.toLowerCase()))) {
        return false;
      }
    }
    
    // Add other filters as needed
    
    return true;
  });
}