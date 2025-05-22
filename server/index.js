import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import weatherRoutes from './routes/api/records.js';
import WeatherRecord from './models/WeatherRecord.js';
import weatherRoute from './routes/api/weather.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use('/api/records', weatherRoutes);
app.use('/api/weather', weatherRoute);

// 🌍 Root
app.get('/', (req, res) => {
  res.send(`
    <h2>🌤️ Weather API is Live</h2>
    <p>Try accessing <code>/api/weather?city=London</code> for data.</p>
  `);
});

// 📡 Weather + 5-day forecast
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City name is required.' });

  try {
    const current = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const forecastRaw = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    const weatherData = current.data;
    const forecast = forecastRaw.data.list.filter((_, i) => i % 8 === 0).slice(0, 5).map(item => ({
      date: item.dt_txt,
      temp: item.main.temp,
      condition: capitalizeFirstLetter(item.weather[0].description),
      icon: item.weather[0].icon
    }));

    res.json({
      location: weatherData.name,
      country: weatherData.sys.country,
      temperature: weatherData.main.temp,
      condition: capitalizeFirstLetter(weatherData.weather[0].description),
      icon: weatherData.weather[0].icon,
      timestamp: weatherData.dt,
      timezone: weatherData.timezone,
      forecast
    });
  } catch (error) {
    console.error("Weather error:", error.message);
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else {
      res.status(500).json({ error: 'Could not fetch weather' });
    }
  }
});

// 📹 YouTube videos
app.get('/api/youtube', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const yt = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: 'snippet',
        q: `${city} travel`,
        key: YOUTUBE_API_KEY,
        maxResults: 5,
        type: 'video'
      }
    });

    const videos = yt.data.items.map(item => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.medium.url
    }));

    res.json(videos);
  } catch (err) {
    console.error("YouTube API error:", err.message);
    res.status(500).json({ error: 'Failed to fetch YouTube videos' });
  }
});

// ✨ Capitalize helper
function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ✅ Start
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});

const mapFrame = `
  <iframe
    width="100%"
    height="100%"
    style="border:0"
    loading="lazy"
    allowfullscreen
    referrerpolicy="no-referrer-when-downgrade"
    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAsMJvxZ0svpk_D5eSQqMeiap3_GLNPSoI&q=${encodeURIComponent(data.location)}">
  </iframe>
`;
document.getElementById("mapDisplay").innerHTML = mapFrame;
document.getElementById("mapDisplay").classList.remove("hidden");
