const { google } = require("googleapis");

// ENV parse + fix private key
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

// AUTH
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
});

const calendar = google.calendar({ version: "v3" });

async function getEvents() {
  const authClient = await auth.getClient();

  const res = await calendar.events.list({
    auth: authClient,
    calendarId: "lakshayengineering14@gmail.com",
    timeMin: new Date().toISOString(),
    maxResults: 5,
    singleEvents: true,
    orderBy: "startTime",
  });

  return res.data.items.map(e => ({
    title: e.summary || "No Title",
    time: new Date(e.start?.dateTime || e.start?.date)
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));
}

module.exports = async (req, res) => {
  try {
    const events = await getEvents();

    res.status(200).json({ events });
  } catch (err) {
    console.error("ERROR:", err); // 🔥 important for logs

    res.status(500).json({
      error: err.message
    });
  }
};
