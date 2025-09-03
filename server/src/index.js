const express = require('express');

const app = express();
const PORT = process.env.PORT || 5001;

// Super einfaches Backend
app.get('/', (req, res) => {
  res.json({
    message: 'Backend is running!',
    timestamp: new Date().toISOString(),
    port: PORT,
    version: '7.0.0'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'Test endpoint works!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend started on port ${PORT}`);
  console.log(`✅ Ready to receive requests`);
});

module.exports = app;