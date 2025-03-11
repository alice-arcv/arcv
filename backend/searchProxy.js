const express = require('express');
const axios = require('axios');
const router = express.Router();

// Your Google Custom Search API key and Search Engine ID
const API_KEY = 'AIzaSyBO6IqUNBsK02rmzqeWaHOWoQD0zeQpSQE';
const SEARCH_ENGINE_ID = 'f19b2d2bc8bb949e3';

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    console.log('Backend searching for:', q);
    
    // Craft a better search query
    // Format: Brand + Model + Colorway + "sneakers shoes"
    // This helps Google understand we want sneaker results
    const terms = q.split(' ');
    const fullSearchTerm = `${q} sneakers shoes detailed`;
    
    console.log('Full search term:', fullSearchTerm);
    
    // Make request to Google Custom Search API with improved parameters
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: fullSearchTerm,
        num: 10, // Get more results
        imgSize: 'large', // Prefer larger images
        imgType: 'photo', // Only actual photos
        safe: 'active', // Safe search
        gl: 'us', // Search in US results
        rights: 'cc_publicdomain cc_attribute cc_sharealike cc_noncommercial' // Freely usable images
      }
    });
    
    console.log('Search successful, found items:', response.data.items?.length || 0);
    
    // Enhance the results to ensure we have image URLs
    const enhancedItems = (response.data.items || []).map(item => {
      // If the item doesn't have an image, try to find one
      if (!item.pagemap?.cse_image?.[0]?.src) {
        // Try to get image from other fields
        const imageUrl = 
          item.pagemap?.cse_thumbnail?.[0]?.src ||
          item.pagemap?.imageobject?.[0]?.url ||
          item.pagemap?.image?.[0]?.src ||
          'https://via.placeholder.com/300?text=No+Image';
        
        // Add the image to the result
        if (!item.pagemap) item.pagemap = {};
        item.pagemap.cse_image = [{ src: imageUrl }];
      }
      
      return item;
    });
    
    // Return the enhanced results
    res.json({
      ...response.data,
      items: enhancedItems
    });
  } catch (error) {
    console.error('Search error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Search failed', 
      details: error.response?.data || error.message 
    });
  }
});

module.exports = router;