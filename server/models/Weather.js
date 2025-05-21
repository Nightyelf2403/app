// 📁 server/models/Weather.js
import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
  location: String,
  temperature: Number,
  condition: String,
  date: Date
});

export default mongoose.model('Weather', weatherSchema);

