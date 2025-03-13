// backend/backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const searchProxy = require('./searchProxy');
const sneakersApiProxy = require('./sneakersApiProxy');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/search', searchProxy);
app.use('/api/sneakers', sneakersApiProxy);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
// In your server.js or main Express file
const sneakersApiProxy = require('./backend/backend/sneakersApiProxy');
const searchProxy = require('./backend/backend/searchProxy');

// Add these routes
app.use('/api/sneakers', sneakersApiProxy);
app.use('/api/search', searchProxy);