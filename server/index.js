const express = require('express');
const axios = require('axios');
const moment = require('moment-timezone');
const app = express();

const OPENWEATHER_API_KEY = '36ffc6ea6c048bb0fcc1752338facd48';

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const weatherData = response.data;
    const timezoneOffset = weatherData.timezone; // in seconds

    res.json({
      location: weatherData.name,
      temperature: weatherData.main.temp,
      condition: weatherData.weather[0].description,
      date: new Date().toISOString(),
      timezone: timezoneOffset,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});
