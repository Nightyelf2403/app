import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import weatherRoute from './routes/api/weather.js';
import recordsRoute from './routes/api/records.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRoute);
app.use('/api/records', recordsRoute);

app.get('/', (req, res) => {
  res.send('<h2>🌤️ Weather API is Live</h2><p>Try /api/weather?city=London</p>');
});

app.get('/api/youtube', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const yt = await axios.get('https://www.googleapis.com/youtube/v3/search', {
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

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
