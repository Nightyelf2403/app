import mongoose from "mongoose";

const WeatherRecordSchema = new mongoose.Schema({
  location: String,
  date: Date,
  temperature: Number,
  condition: String,
  notes: String // optional: for updates/annotations
}, { timestamps: true });

export default mongoose.model("WeatherRecord", WeatherRecordSchema);
