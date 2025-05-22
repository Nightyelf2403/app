// routes/api/weather.js

import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// 🌤️ GET /api/weather?city=CityName
router.get('/', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City name is required' });

  try {
    // Step 1: Get lat/lon from city name
    const geoRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    const { coord, name, sys, main, weather, timezone, dt } = geoRes.data;

    // Step 2: Use One Call API 3.0 to get forecast
    const oneCallRes = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,alerts&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    // Step 3: Parse forecast (5-day)
    const forecast = oneCallRes.data.daily.slice(0, 5).map(day => ({
      date: new Date(day.dt * 1000).toISOString(),
      temp: day.temp.day,
      condition: day.weather[0].description,
      icon: day.weather[0].icon
    }));

    // Step 4: Parse hourly forecast (today only)
    const today = new Date().toISOString().split('T')[0];
    const hourly = oneCallRes.data.hourly
      .filter(hour => new Date(hour.dt * 1000).toISOString().startsWith(today))
      .slice(0, 8)
      .map(hour => ({
        hour: new Date(hour.dt * 1000).toLocaleTimeString('en-US', {
          hour: 'numeric', hour12: true
        }),
        temp: hour.temp,
        icon: hour.weather[0].icon,
        condition: hour.weather[0].description
      }));

    res.json({
      location: name,
      country: sys.country,
      temperature: main.temp,
      condition: weather[0].description,
      icon: weather[0].icon,
      timestamp: dt,
      timezone,
      forecast,
      hourly
    });
  } catch (err) {
    console.error("❌ Weather fetch failed:", err.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

export default router;
