const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;
const CONFIG_DIR = '/app/config';
const CONFIG_FILE = path.join(CONFIG_DIR, 'last-config.json');

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API: Save configuration to disk
app.post('/api/config/save', (req, res) => {
  try {
    const config = req.body;
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    res.json({ success: true, message: 'Configuration saved to disk' });
  } catch (error) {
    console.error('Error saving config:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Load configuration from disk
app.get('/api/config/load', (req, res) => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const config = fs.readFileSync(CONFIG_FILE, 'utf-8');
      res.json(JSON.parse(config));
    } else {
      res.status(404).json({ success: false, error: 'No saved configuration found' });
    }
  } catch (error) {
    console.error('Error loading config:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Visual Subnet Calculator server running on port ${PORT}`);
});
