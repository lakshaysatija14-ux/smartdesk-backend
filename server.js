const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Utility function to read data
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data.json:', error);
    return {};
  }
};

// Utility function to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to data.json:', error);
  }
};

// GET /api/data
// Used by the hardware screen to fetch the latest data
app.get('/api/data', (req, res) => {
  const data = readData();
  res.json(data);
});

// POST /api/data
// Used by the frontend to push updates
// Expects an object representing the entire state or updates
app.post('/api/data', (req, res) => {
  const currentData = readData();
  const newData = req.body;

  // Merge the new data with the current data
  // Using spread operator for a shallow merge. You can modify this for deep merging if needed.
  const updatedData = { ...currentData, ...newData };

  writeData(updatedData);

  res.json({ message: 'Data updated successfully', data: updatedData });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Hardware Backend API running on http://localhost:${PORT}`);
});
