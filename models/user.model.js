const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  done: Boolean
}, { _id: false });

const messageSchema = new mongoose.Schema({
  sender: String,
  time: String,
  text: String,
  isDesk: Boolean
}, { _id: false });

const calendarEventSchema = new mongoose.Schema({
  date: Number,
  events: [String]
}, { _id: false });

const dataSchema = new mongoose.Schema({
  weather: {
    temp: Number,
    condition: String,
    humidity: Number,
    city: String
  },
  alarms: [String],
  quotes: String,
  tasks: [taskSchema],
  deskMessages: [messageSchema],
  calendarEvents: [calendarEventSchema]
}, { timestamps: true });

module.exports = mongoose.model('Data', dataSchema);