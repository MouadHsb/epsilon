const express = require("express");
const cors = require("cors");
const app = express();
const productRoutes = require('./routes/products');

// CORS Configuration - More permissive for development
app.use(cors());  // This enables CORS for all origins by default

// Additional explicit CORS headers for troubleshooting
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Middleware to parse JSON requests
app.use(express.static('public'));

// Mount product routes
app.use('/api/products', productRoutes);

// Test route to verify API is working
app.get('/api', (req, res) => {
  res.json({ status: 'API is running', message: 'Hello from Tadefi API!' });
});

// Set port from environment or default to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the API at http://localhost:${PORT}/api`);
});

module.exports = app;