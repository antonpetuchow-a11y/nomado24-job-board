const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001; // Wichtig: Port 5001 für Cloud Run

// Middleware
app.use(cors({
  origin: [
    'https://nomado24.de',
    'https://www.nomado24.de',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend is running!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    port: PORT,
    version: '6.0.0'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'nomado24-backend',
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Nomado24 Backend API',
    status: 'running',
    version: '6.0.0',
    port: PORT,
    endpoints: ['/api/test', '/api/health']
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend started on port ${PORT}`);
  console.log(`✅ Ready to receive requests`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;