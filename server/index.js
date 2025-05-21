// 📁 server/index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import Weather from './models/Weather.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Fetch weather and store
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).send('City required');

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    const weatherData = {
      location: city,
      temperature: response.data.main.temp,
      condition: response.data.weather[0].main,
      date: new Date()
    };

    const saved = await Weather.create(weatherData);
    res.json(saved);
  } catch (error) {
    res.status(500).send('Error fetching weather');
  }
});

// Get weather history
app.get('/api/history', async (req, res) => {
  const data = await Weather.find().sort({ date: -1 });
  res.json(data);
});

// Delete entry by ID
app.delete('/api/weather/:id', async (req, res) => {
  const { id } = req.params;
  await Weather.findByIdAndDelete(id);
  res.send('Deleted');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

