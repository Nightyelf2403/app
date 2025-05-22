import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const API_KEY = process.env.OPENWEATHER_API_KEY;

router.get('/', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City name is required' });

  try {
    const current = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const forecast = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    const forecastData = forecast.data.list.filter((_, i) => i % 8 === 0).slice(0, 5).map(item => ({
      date: item.dt_txt,
      temp: item.main.temp,
      condition: item.weather[0].description,
      icon: item.weather[0].icon
    }));

    res.json({
      location: current.data.name,
      temperature: current.data.main.temp,
      condition: current.data.weather[0].description,
      icon: current.data.weather[0].icon,
      forecast: forecastData
    });
  } catch (err) {
    console.error("❌ Weather fetch failed:", err.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

export default router;
