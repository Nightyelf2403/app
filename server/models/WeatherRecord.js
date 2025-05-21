import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  location: String,
  date: String,
  temperature: Number,
  condition: String,
  notes: String,
}, { timestamps: true });

export default mongoose.model('WeatherRecord', recordSchema);
