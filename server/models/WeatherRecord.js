import mongoose from 'mongoose';

const WeatherRecordSchema = new mongoose.Schema({
  location: { type: String, required: true },
  date: { type: Date, required: true },
  temperature: Number,
  condition: String,
  notes: String
}, {
  timestamps: true
});

export default mongoose.model("WeatherRecord", WeatherRecordSchema);
