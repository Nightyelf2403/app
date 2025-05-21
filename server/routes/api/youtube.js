import { google } from 'googleapis';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

app.get('/api/youtube', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City name required' });

  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: YOUTUBE_API_KEY
    });

    const response = await youtube.search.list({
      q: `${city} travel`,
      part: 'snippet',
      maxResults: 2,
      type: 'video',
    });

    const videos = response.data.items.map(item => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.medium.url
    }));

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'YouTube API failed' });
  }
});
