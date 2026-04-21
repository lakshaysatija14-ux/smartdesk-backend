const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./db.js');
const Data = require('./models/user.model.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

connectDB();


// ✅ GET DATA
app.get('/api/data', async (req, res) => {
  try {
    let data = await Data.findOne();

    // If no data exists → create default empty doc
    if (!data) {
      data = await Data.create({});
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ ROOT
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Backend API" });
});


// ✅ POST (UPDATE / MERGE DATA)
app.post('/api/data', async (req, res) => {
  try {
    const newData = req.body;

    let existingData = await Data.findOne();

    if (!existingData) {
      // First time → create
      const created = await Data.create(newData);
      return res.json({ message: 'Data created', data: created });
    }

    // Merge like your old logic
    Object.assign(existingData, newData);

    const updated = await existingData.save();

    res.json({ message: 'Data updated successfully', data: updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});