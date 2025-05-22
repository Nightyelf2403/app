import express from 'express';
import axios from 'axios';

const router = express.Router();
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Route: GET /api/youtube?city=Paris
router.get('/', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${city} travel guide`,
        maxResults: 5,
        type: 'video',
        key: YOUTUBE_API_KEY,
      }
    });

    const videos = response.data.items.map(item => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle
    }));

    res.json({ city, videos });
  } catch (error) {
    console.error('YouTube API Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch YouTube videos' });
  }
});

export default router;
