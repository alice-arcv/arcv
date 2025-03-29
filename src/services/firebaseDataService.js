// frontend/src/services/firebaseDataService.js
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Main function to search sneakers from Firebase
export async function searchSneakersFromFirebase(searchTerm, filters = {}) {
  try {
    console.log('Searching Firebase for:', searchTerm, 'with filters:', filters);
    
    // Reference to the sneakers collection
    const sneakersRef = collection(db, "sneakers");
    
    // Start building query
    let q = sneakersRef;
    
    // If there's a search term, we need to perform more complex queries
    // This is a simple implementation - in a real app, you would use Firestore's
    // more advanced querying capabilities or a service like Algolia
    if (searchTerm) {
      // For now, we'll just get all sneakers and filter in memory
      // In a production app, you'd use a better approach
      const querySnapshot = await getDocs(sneakersRef);
      let results = [];
      
      querySnapshot.forEach((doc) => {
        const sneaker = { id: doc.id, ...doc.data() };
        const searchLower = searchTerm.toLowerCase();
        
        // Check if the sneaker matches the search term
        if (
          sneaker.name?.toLowerCase().includes(searchLower) ||
          sneaker.brand?.toLowerCase().includes(searchLower) ||
          sneaker.colorway?.toLowerCase().includes(searchLower) ||
          (sneaker.tags && sneaker.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        ) {
          results.push(sneaker);
        }
      });
      
      // Apply filters to the results
      results = applyFilters(results, filters);
      
      console.log('Firebase search found:', results.length, 'results');
      return results;
    } else {
      // Apply filters to the query if possible
      if (filters.brand) {
        q = query(q, where("brand", "==", filters.brand));
      }
      
      // Get the results
      const querySnapshot = await getDocs(q);
      let results = [];
      
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      
      // For filters that can't be directly applied to the Firestore query,
      // apply them to the results in memory
      results = applyFilters(results, filters);
      
      console.log('Firebase search found:', results.length, 'results');
      return results;
    }
  } catch (error) {
    console.error('Error searching in Firebase:', error);
    return [];
  }
}

// Save a sneaker to Firebase
export async function saveSneakerToFirebase(sneakerData) {
  try {
    // Add a timestamp
    const sneakerWithTimestamp = {
      ...sneakerData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Add to the sneakers collection
    const docRef = await addDoc(collection(db, "sneakers"), sneakerWithTimestamp);
    console.log('Sneaker saved to Firebase with ID:', docRef.id);
    
    // Return the saved sneaker with its ID
    return {
      id: docRef.id,
      ...sneakerWithTimestamp
    };
  } catch (error) {
    console.error('Error saving sneaker to Firebase:', error);
    throw error;
  }
}

// Apply filters to the results
function applyFilters(results, filters) {
  if (!results || !Array.isArray(results) || results.length === 0) return [];
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
    
    // Check for color in tags too
    if (filters.color && sneaker.tags) {
      const colorInTags = sneaker.tags.some(tag => 
        tag.toLowerCase().includes(filters.color.toLowerCase())
      );
      if (!colorInTags && !sneaker.colorway?.toLowerCase().includes(filters.color.toLowerCase())) {
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

// Get all sneakers from Firebase
export async function getAllSneakers() {
  try {
    const querySnapshot = await getDocs(collection(db, "sneakers"));
    const sneakers = [];
    
    querySnapshot.forEach((doc) => {
      sneakers.push({ id: doc.id, ...doc.data() });
    });
    
    return sneakers;
  } catch (error) {
    console.error('Error getting sneakers from Firebase:', error);
    return [];
  }
}

export default {
  searchSneakersFromFirebase,
  saveSneakerToFirebase,
  getAllSneakers
};