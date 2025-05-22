import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

router.get('/', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City name is required' });

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    const data = response.data;
    res.json({
      location: data.name,
      temperature: data.main.temp,
      condition: data.weather[0].description,
      icon: data.weather[0].icon
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

export default router;
