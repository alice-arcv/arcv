// frontend/src/services/firebaseSearchService.js
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// Main search function
export async function searchFirebase(searchTerm, filters = {}) {
  try {
    console.log('Searching Firebase for:', searchTerm, 'with filters:', filters);
    
    // Get reference to sneakers collection
    const sneakersRef = collection(db, "sneakers");
    
    // Get all sneakers - we'll filter them client-side
    // In a production app, you'd want to use more efficient queries
    const querySnapshot = await getDocs(sneakersRef);
    
    // Convert to array of sneaker objects
    let allSneakers = [];
    querySnapshot.forEach((doc) => {
      allSneakers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Found ${allSneakers.length} total sneakers in Firebase`);
    
    // Filter by search term
    let results = allSneakers;
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      results = results.filter(sneaker => 
        (sneaker.name && sneaker.name.toLowerCase().includes(term)) || 
        (sneaker.colorway && sneaker.colorway.toLowerCase().includes(term)) || 
        (sneaker.brand && sneaker.brand.toLowerCase().includes(term)) ||
        (sneaker.description && sneaker.description.toLowerCase().includes(term)) ||
        (sneaker.tags && Array.isArray(sneaker.tags) && 
         sneaker.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    // Apply filters
    results = applyFilters(results, filters);
    
    console.log(`Returning ${results.length} filtered results from Firebase`);
    return results;
  } catch (error) {
    console.error('Error searching Firebase:', error);
    return [];
  }
}

// Apply filters function
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
    if (filters.color && sneaker.colorway) {
      if (!sneaker.colorway.toLowerCase().includes(filters.color.toLowerCase())) {
        return false;
      }
    }
    
    // Check color in tags as well
    if (filters.color && sneaker.tags && Array.isArray(sneaker.tags)) {
      if (!sneaker.colorway?.toLowerCase().includes(filters.color.toLowerCase()) && 
          !sneaker.tags.some(tag => tag.toLowerCase().includes(filters.color.toLowerCase()))) {
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
      if (filters.price.min && (!sneaker.price || sneaker.price < filters.price.min)) {
        return false;
      }
      if (filters.price.max && (!sneaker.price || sneaker.price > filters.price.max)) {
        return false;
      }
    }
    
    return true;
  });
}

export default {
  searchFirebase
};