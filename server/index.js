import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.get('/', (req, res) => {
  res.send('Weather API is running');
});

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const weatherData = response.data;
    const timezone = weatherData.timezone; // offset in seconds

    res.json({
      location: weatherData.name,
      temperature: weatherData.main.temp,
      condition: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      date: new Date().toISOString(),
      timezone,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
