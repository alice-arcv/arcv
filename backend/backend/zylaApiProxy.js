// backend/backend/zylaApiProxy.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Debug logs to verify API key is loaded
console.log('ZYLA_API_KEY present:', !!process.env.ZYLA_API_KEY);
console.log('ZYLA_API_KEY length:', process.env.ZYLA_API_KEY ? process.env.ZYLA_API_KEY.length : 0);

// Your Zyla API Hub API key (will be loaded from environment variables)
const API_KEY = process.env.ZYLA_API_KEY;

// Search route
router.get('/search', async (req, res) => {
  try {
    const { query, limit = 20, page = 0 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    console.log('Searching Zyla Sneakers Database API for:', query);
    console.log('Using API key (length):', API_KEY ? API_KEY.length : 0);
    
    // Make request to Zyla API Hub
    try {
      const response = await axios.get('https://zylalabs.com/api/916/sneakers+database+api/731/search+sneaker', {
        params: {
          limit: limit,
          page: page,
          query: query
        },
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      
      console.log('Zyla API request successful!');
      console.log('Results count:', response.data.count);
      res.json(response.data);
    } catch (apiError) {
      // Log more details about the API error
      console.error('Zyla API error details:', {
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data
      });
      
      res.status(apiError.response?.status || 500).json({ 
        error: 'Zyla API request failed', 
        details: apiError.response?.data || apiError.message 
      });
    }
  } catch (error) {
    console.error('General error in zylaApiProxy:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Get specific sneaker details by ID
router.get('/:sneakerId', async (req, res) => {
  try {
    const { sneakerId } = req.params;
    
    // Make request to Zyla API Hub
    const response = await axios.get('https://zylalabs.com/api/916/sneakers+database+api/733/get+sneaker+by+id', {
      params: {
        sneaker_id: sneakerId
      },
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Zyla API error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Zyla API request failed', 
      details: error.response?.data || error.message 
    });
  }
});

// Get supported brands
router.get('/brands/list', async (req, res) => {
  try {
    // Make request to Zyla API Hub
    const response = await axios.get('https://zylalabs.com/api/916/sneakers+database+api/729/get+supported+brands', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Zyla API error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Zyla API request failed', 
      details: error.response?.data || error.message 
    });
  }
});

// Test route for easy API verification
router.get('/test', async (req, res) => {
  try {
    console.log('Testing Zyla API connection...');
    console.log('API key present:', !!API_KEY);
    console.log('API key length:', API_KEY ? API_KEY.length : 0);
    
    const response = await axios.get('https://zylalabs.com/api/916/sneakers+database+api/729/get+supported+brands', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
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