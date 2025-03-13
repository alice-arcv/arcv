// backend/server.js
const express = require('express');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Import route files
const sneakersApiProxy = require('./backend/sneakersApiProxy');
const searchProxy = require('./backend/searchProxy');
// Import other route files as needed

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes - Mount your proxies
app.use('/api/sneakers', sneakersApiProxy);
app.use('/api/search', searchProxy);
// Mount other routes as needed

// Test route to check if API key is set
app.get('/api/test-env', (req, res) => {
  const hasApiKey = !!process.env.SNEAKERS_API_KEY;
  res.json({ 
    hasApiKey: hasApiKey,
    apiKeyLength: hasApiKey ? process.env.SNEAKERS_API_KEY.length : 0,
    nodeEnv: process.env.NODE_ENV
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SneakersAPI key is ${process.env.SNEAKERS_API_KEY ? 'set' : 'NOT SET'}`);
});
// At the top of your server.js file
require('dotenv').config();
console.log('Environment loaded, API key present:', !!process.env.SNEAKERS_API_KEY);