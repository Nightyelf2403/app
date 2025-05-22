import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const API_KEY = process.env.OPENWEATHER_API_KEY;

router.get("/", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City name is required" });

  try {
    const current = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const onecall = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${current.data.coord.lat}&lon=${current.data.coord.lon}&exclude=minutely,alerts&appid=${API_KEY}&units=metric`);

    const forecast = onecall.data.daily.slice(0, 5).map(day => ({
      date: new Date(day.dt * 1000).toISOString(),
      temp: day.temp.day,
      condition: day.weather[0].description,
      icon: day.weather[0].icon
    }));

    const hourly = onecall.data.hourly.slice(0, 8).map(h => ({
      dt: h.dt,
      temp: h.temp,
      weather: h.weather
    }));

    res.json({
      location: current.data.name,
      temperature: current.data.main.temp,
      condition: current.data.weather[0].description,
      icon: current.data.weather[0].icon,
      forecast,
      hourly
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

export default router;
