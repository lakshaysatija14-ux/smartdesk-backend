const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
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
    title: e.summary,
    time: new Date(e.start.dateTime || e.start.date)
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));
}

module.exports = async (req, res) => {
  try {
    const events = await getEvents();

    res.status(200).json({
      events: events
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
