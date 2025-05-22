import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  const key = process.env.OPENWEATHER_API_KEY;

  try {
    const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`);
    const forecast = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=metric`);
    const weatherData = weather.data;
    res.json({
      location: weatherData.name,
      temperature: weatherData.main.temp,
      condition: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      forecast: forecast.data.list
    });
  } catch (err) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

app.get('/api/youtube', async (req, res) => {
  const city = req.query.city;
  const ytKey = process.env.YOUTUBE_API_KEY;

  try {
    const yt = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: "snippet",
        q: `${city} travel`,
        key: ytKey,
        maxResults: 3,
        type: "video"
      }
    });

    const videos = yt.data.items.map(item => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.medium.url
    }));

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "YouTube fetch failed" });
  }
});

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
