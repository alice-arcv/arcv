// backend/server.js
const express = require('express');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Log on startup to verify environment loading
console.log('Server starting up...');
console.log('Environment loaded, API keys present:');
console.log('- SNEAKERS_API_KEY:', !!process.env.SNEAKERS_API_KEY);
console.log('- ZYLA_API_KEY:', !!process.env.ZYLA_API_KEY);

// Import route files
const sneakersApiProxy = require('./backend/sneakersApiProxy');
const zylaApiProxy = require('./backend/zylaApiProxy'); // Add this line
const searchProxy = require('./backend/searchProxy');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes - Mount your proxies
app.use('/api/sneakers', sneakersApiProxy); // Keep this for backward compatibility
app.use('/api/zyla', zylaApiProxy); // Add this line for the new API
app.use('/api/search', searchProxy);

// Test route to check if API keys are set
app.get('/api/test-env', (req, res) => {
  res.json({ 
    sneakersApiKey: {
      present: !!process.env.SNEAKERS_API_KEY,
      length: process.env.SNEAKERS_API_KEY ? process.env.SNEAKERS_API_KEY.length : 0
    },
    zylaApiKey: {
      present: !!process.env.ZYLA_API_KEY,
      length: process.env.ZYLA_API_KEY ? process.env.ZYLA_API_KEY.length : 0
    },
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
});