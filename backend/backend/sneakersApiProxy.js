// At the top of your sneakersApiProxy.js file
console.log('SNEAKERS_API_KEY present:', !!process.env.SNEAKERS_API_KEY);
console.log('SNEAKERS_API_KEY length:', process.env.SNEAKERS_API_KEY ? process.env.SNEAKERS_API_KEY.length : 0);

// Your SneakersAPI.dev API key (will be loaded from environment variables)
const API_KEY = process.env.SNEAKERS_API_KEY;

// backend/backend/sneakersApiProxy.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Your SneakersAPI.dev API key (will be loaded from environment variables)
const API_KEY = process.env.SNEAKERS_API_KEY;

// Search route
router.get('/search', async (req, res) => {
  try {
    const { query, limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    console.log('Searching SneakersAPI for:', query);
    
    // Make request to SneakersAPI.dev
    const response = await axios.get('https://sneakersapi.dev/api/v1/sneakers/search', {
      params: {
        query: query,
        limit: limit
      },
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('SneakersAPI error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'SneakersAPI request failed', 
      details: error.response?.data || error.message 
    });
  }
});

// Get specific sneaker details
router.get('/:sneakerId', async (req, res) => {
  try {
    const { sneakerId } = req.params;
    
    // Make request to SneakersAPI.dev
    const response = await axios.get(`https://sneakersapi.dev/api/v1/sneakers/${sneakerId}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('SneakersAPI error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'SneakersAPI request failed', 
      details: error.response?.data || error.message 
    });
  }
});

module.exports = router;