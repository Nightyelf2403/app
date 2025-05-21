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

// 📡 Weather data route
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const weatherData = response.data;

    res.json({
  location: weatherData.name,
  country: weatherData.sys.country,
  temperature: weatherData.main.temp,
  condition: capitalizeFirstLetter(weatherData.weather[0].description),
  icon: weatherData.weather[0].icon,
  timestamp: weatherData.dt,            
  timezone: weatherData.timezone
});
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch weather data.' });
  }
});

// ✨ Capitalize first letter of condition
function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
