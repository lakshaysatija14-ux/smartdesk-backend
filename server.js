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

    // ✅ CREATE FIRST DOCUMENT
    if (!existingData) {

      // Clean initial messages
      if (newData.deskMessages) {
        newData.deskMessages = newData.deskMessages
          .filter(msg => msg.text && msg.text.trim() !== "")
          .map(msg => ({
            text: msg.text.trim(),
            time: msg.time || ''
          }))
          .slice(-20);
      }

      // Clean initial calendar events
      if (newData.calendarEvents) {
        newData.calendarEvents = newData.calendarEvents
          .filter(e => e.date && e.events?.length)
          .slice(-15);
      }

      const created = await Data.create(newData);

      return res.json({
        message: 'Data created',
        data: created
      });
    }


    // ✅ HANDLE DESK MESSAGES
    if (newData.deskMessages) {

      const validMessages = newData.deskMessages

        // Remove empty messages
        .filter(msg => msg.text && msg.text.trim() !== "")

        // Format messages
        .map(msg => ({
          text: msg.text.trim(),
          time: msg.time || ''
        }));


      existingData.deskMessages = [

        ...(existingData.deskMessages || []),
        ...validMessages

      ]

      // Remove duplicates
      .filter((msg, index, self) =>
        index === self.findIndex(
          m => m.text === msg.text && m.time === msg.time
        )
      )

      // Keep latest 20 only
      .slice(-20);
    }



    // ✅ HANDLE CALENDAR EVENTS
    if (newData.calendarEvents) {

      const validEvents = newData.calendarEvents.filter(
        e => e.date && e.events?.length
      );

      existingData.calendarEvents = [

        ...(existingData.calendarEvents || []),
        ...validEvents

      ]

      // Keep latest 15 events only
      .slice(-15);
    }



    // ✅ MERGE OTHER FIELDS SAFELY
    Object.assign(existingData, {

      ...newData,

      // Preserve cleaned arrays
      deskMessages: existingData.deskMessages,
      calendarEvents: existingData.calendarEvents

    });


    // ✅ SAVE UPDATED DATA
    const updated = await existingData.save();

    res.json({
      message: 'Data updated successfully',
      data: updated
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});


// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
