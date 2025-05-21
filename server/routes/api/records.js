import express from 'express';
import WeatherRecord from '../../models/WeatherRecord.js';

const router = express.Router();

// READ
router.get('/', async (req, res) => {
  try {
    const records = await WeatherRecord.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve records.' });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updated = await WeatherRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed.' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await WeatherRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed.' });
  }
});

export default router;
