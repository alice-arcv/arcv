// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001; // Changed from 5000 to 5001

// Middleware
// Allow all origins for testing purposes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint with explicit CORS headers
app.get('/api/health', (req, res) => {
  // Set explicit CORS headers for this endpoint
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// KicksDB API endpoint
app.get('/api/search/kicksdb', async (req, res) => {
  try {
    // Extract query parameters
    const { query, limit = 50, sort = 'release_date' } = req.query;
    
    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Query parameter is required'
      });
    }
    
    // Construct KicksDB API URL
    const kicksDbUrl = 'https://api.kicks.dev/v3/stockx/products';
    
    // Make request to KicksDB API
    const response = await axios.get(kicksDbUrl, {
      params: {
        query,
        limit,
        sort,
        'display[variants]': 'true',
        'display[traits]': 'true'
      },
      headers: {
        // Modified: Removed 'Bearer ' prefix as per KicksDB documentation
        'Authorization': process.env.KICKSDB_API_KEY
      }
    });
    
    // Return the data from KicksDB
    res.json({
      status: 'success',
      data: response.data,
      source: 'kicksdb'
    });
    
  } catch (error) {
    console.error('Error fetching from KicksDB:', error.message);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(error.response.status).json({
        status: 'error',
        message: 'Error from KicksDB API',
        error: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(503).json({
        status: 'error',
        message: 'No response from KicksDB API',
        error: 'Service unavailable'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({
        status: 'error',
        message: 'Error setting up request to KicksDB API',
        error: error.message
      });
    }
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Health check available at: http://localhost:${port}/api/health`);
});

module.exports = app;
