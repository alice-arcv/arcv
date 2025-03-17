// backend/backend/sneakersApiProxy.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Debug logs to verify API key is loaded
console.log('SNEAKERS_API_KEY present:', !!process.env.SNEAKERS_API_KEY);
console.log('SNEAKERS_API_KEY length:', process.env.SNEAKERS_API_KEY ? process.env.SNEAKERS_API_KEY.length : 0);

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
    console.log('Using API key (length):', API_KEY ? API_KEY.length : 0);
    
    // Make request to SneakersAPI.dev
    try {
      const response = await axios.get('https://sneakersapi.dev/api/v1/sneakers/search', {
        params: {
          query: query,
          limit: limit,
          includeMarketData: 'true',
          sort: 'relevance'
        },
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      
      console.log('SneakersAPI request successful!');
      res.json(response.data);
    } catch (apiError) {
      // Log more details about the API error
      console.error('SneakersAPI error details:', {
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data
      });
      
      res.status(apiError.response?.status || 500).json({ 
        error: 'SneakersAPI request failed', 
        details: apiError.response?.data || apiError.message 
      });
    }
  } catch (error) {
    console.error('General error in sneakersApiProxy:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
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

// Add a test route for easy API verification
router.get('/test', async (req, res) => {
  try {
    console.log('Testing SneakersAPI connection...');
    console.log('API key present:', !!API_KEY);
    console.log('API key length:', API_KEY ? API_KEY.length : 0);
    
    const response = await axios.get('https://sneakersapi.dev/api/v1/sneakers/search', {
      params: { query: 'jordan', limit: 1 },
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    
    res.json({
      success: true,
      status: response.status,
      data: response.data
    });
  } catch (error) {
    console.error('Test route error:', error.message);
    console.error('Error details:', error.response?.data);
    
    res.status(500).json({
      success: false,
      status: error.response?.status,
      message: error.message,
      details: error.response?.data
    });
  }
});

module.exports = router;