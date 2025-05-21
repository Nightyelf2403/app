import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

// 🌍 Root route for direct browser visit
app.get('/', (req, res) => {
  res.send(`
    <h2>🌤️ Weather API is Live</h2>
    <p>Try accessing <code>/api/weather?city=London</code> for data.</p>
  `);
});

// 📡 Main weather API route
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City name is required.' });
  }

  try {
    // Fetch current weather
    const currentWeatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const weatherData = currentWeatherRes.data;

    // Fetch 5-day forecast
    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    // Filter every 8th item for daily forecast (3-hour intervals * 8 = 24 hrs)
    const forecastData = forecastRes.data.list.filter((_, i) => i % 8 === 0).slice(0, 5);

    const forecast = forecastData.map(item => ({
      date: item.dt_txt,
      temp: item.main.temp,
      condition: capitalizeFirstLetter(item.weather[0].description),
      icon: item.weather[0].icon
    }));

    // Final response
    res.json({
      location: weatherData.name,
      country: weatherData.sys.country,
      temperature: weatherData.main.temp,
      condition: capitalizeFirstLetter(weatherData.weather[0].description),
      icon: weatherData.weather[0].icon,
      timestamp: weatherData.dt,
      timezone: weatherData.timezone,
      forecast: forecast
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'City not found. Please try again.' });
    } else {
      res.status(500).json({ error: 'Could not fetch weather data.' });
    }
  }
});

// ✨ Capitalize first letter of condition
function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
