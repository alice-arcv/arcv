// src/services/stockxApiService.js

// Your StockX API credentials
const API_KEY = 'your_api_key_here';

// Get JWT token (you'll need to implement the authentication flow)
const getJwtToken = async () => {
  // Implementation depends on StockX's authentication requirements
  // You might need to exchange credentials for a JWT
  
  return 'your_jwt_token';
};

// Get listings for a specific product
export const getListingsForProduct = async (productId, pageNumber = 1, pageSize = 10) => {
  try {
    const jwt = await getJwtToken();
    
    const url = new URL('https://api.stockx.com/v2/selling/listings');
    url.searchParams.append('pageNumber', pageNumber);
    url.searchParams.append('pageSize', pageSize);
    
    if (productId) {
      url.searchParams.append('productIds', productId);
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'x-api-key': API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`StockX API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching StockX listings:', error);
    return null;
  }
};

// Get all listings with filters
export const getAllListings = async (filters = {}) => {
  try {
    const jwt = await getJwtToken();
    
    const url = new URL('https://api.stockx.com/v2/selling/listings');
    
    // Add all filter parameters
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        url.searchParams.append(key, filters[key]);
      }
    });
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'x-api-key': API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`StockX API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching StockX listings:', error);
    return null;
  }
};
// Add to your stockxApiService.js file

// Find StockX product ID by sneaker name and brand
export const findStockXProductId = async (sneakerName, brand) => {
    try {
      // Implementation depends on what search endpoint StockX provides
      // This is a placeholder - you'd need to use their search API
      
      // Example using a hypothetical search endpoint
      const jwt = await getJwtToken();
      const response = await fetch(`https://api.stockx.com/v2/catalog/search?query=${encodeURIComponent(sneakerName + ' ' + brand)}`, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'x-api-key': API_KEY
        }
      });
      
      const data = await response.json();
      if (data.products && data.products.length > 0) {
        return data.products[0].id;  // Return the first matching product ID
      }
      
      return null;
    } catch (error) {
      console.error('Error finding StockX product:', error);
      return null;
    }
  };