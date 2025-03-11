import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

// Your existing searchSneakers function
export async function searchSneakers(searchTerm) {
  // ... existing code ...
}

// The new extractAndSaveSneakerData function (replace the old one with this)
export async function extractAndSaveSneakerData(searchResults) {
  console.log('Processing search results for database storage:', searchResults);
  
  const sneakers = [];
  
  for (const result of searchResults) {
    try {
      // More sophisticated brand extraction
      let brand = 'Unknown';
      const brandMatches = {
        'Nike': ['Nike', 'Air Jordan', 'Jordan'],
        'Adidas': ['Adidas', 'Yeezy'],
        'New Balance': ['New Balance'],
        'Puma': ['Puma'],
        'Reebok': ['Reebok'],
        'Converse': ['Converse'],
        'Vans': ['Vans'],
        'Asics': ['Asics']
      };
      
      const titleAndSnippet = `${result.title} ${result.snippet}`.toLowerCase();
      
      // Check for each brand
      Object.entries(brandMatches).forEach(([brandName, keywords]) => {
        for (const keyword of keywords) {
          if (titleAndSnippet.includes(keyword.toLowerCase())) {
            brand = brandName;
            break;
          }
        }
      });
      
      // Try to extract model and colorway
      let model = '';
      let colorway = '';
      
      // Common models
      const modelPatterns = [
        { regex: /air\s+jordan\s+(\d+)/i, brand: 'Nike', prefix: 'Air Jordan' },
        { regex: /dunk\s+(high|low|mid)/i, brand: 'Nike', prefix: 'Dunk' },
        { regex: /air\s+force\s+(\d+)/i, brand: 'Nike', prefix: 'Air Force' },
        { regex: /yeezy\s+boost\s+(\d+)/i, brand: 'Adidas', prefix: 'Yeezy Boost' },
        { regex: /yeezy\s+(\d+)/i, brand: 'Adidas', prefix: 'Yeezy' },
        { regex: /ultra\s*boost/i, brand: 'Adidas', prefix: 'Ultra Boost' },
        { regex: /nmd/i, brand: 'Adidas', prefix: 'NMD' }
      ];
      
      // Try to match models
      for (const pattern of modelPatterns) {
        const match = titleAndSnippet.match(pattern.regex);
        if (match) {
          model = match[0];
          if (match[1]) {
            model = `${pattern.prefix} ${match[1]}`;
          }
          break;
        }
      }
      
      // Common colorway names
      const colorwayKeywords = [
        'Bred', 'Chicago', 'Royal', 'Shadow', 'Mocha', 'University Blue', 
        'Zebra', 'Beluga', 'Oreo', 'Turtle Dove', 'Red October',
        'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple',
        'Pink', 'Grey', 'Gray', 'Brown', 'Tan', 'Navy', 'Olive'
      ];
      
      // Try to extract colorway
      for (const color of colorwayKeywords) {
        if (titleAndSnippet.includes(color.toLowerCase())) {
          colorway = color;
          break;
        }
      }
      
      // Generate meaningful tags
      const tags = ['sneakers'];
      if (brand !== 'Unknown') tags.push(brand.toLowerCase());
      
      // Tag patterns
      const tagPatterns = [
        { regex: /retro/i, tag: 'retro' },
        { regex: /limited\s+edition/i, tag: 'limited edition' },
        { regex: /collaboration|collab/i, tag: 'collaboration' },
        { regex: /high|low|mid/i, tag: match => match[0].toLowerCase() },
        { regex: /basketball/i, tag: 'basketball' },
        { regex: /running/i, tag: 'running' },
        { regex: /skate|skating/i, tag: 'skateboarding' },
        { regex: /boost/i, tag: 'boost' },
        { regex: /air/i, tag: 'air' }
      ];
      
      // Add matched tags
      tagPatterns.forEach(({ regex, tag }) => {
        const match = titleAndSnippet.match(regex);
        if (match) {
          if (typeof tag === 'function') {
            tags.push(tag(match));
          } else {
            tags.push(tag);
          }
        }
      });
      
      // Add color tags
      colorwayKeywords.forEach(color => {
        if (titleAndSnippet.includes(color.toLowerCase())) {
          tags.push(color.toLowerCase());
        }
      });
      
      // Create sneaker data with more detailed info
      const sneakerData = {
        name: result.title,
        description: result.snippet,
        sourceUrl: result.link,
        brand,
        model: model || 'Unknown',
        colorway: colorway || 'Unknown',
        images: [
          {
            url: result.pagemap?.cse_image?.[0]?.src || 'https://via.placeholder.com/300',
            altText: result.title,
            isPrimary: true
          }
        ],
        tags: [...new Set(tags)], // Remove duplicates
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save to Firebase
      const docRef = await addDoc(collection(db, 'sneakers'), sneakerData);
      console.log('Added sneaker with ID:', docRef.id);
      
      // Add to return array
      sneakers.push({
        id: docRef.id,
        ...sneakerData
      });
    } catch (error) {
      console.error('Error saving sneaker:', error);
    }
  }
  
  return sneakers;
}

// Any existing helper functions you might have