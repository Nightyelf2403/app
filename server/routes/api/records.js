import express from 'express';
import WeatherRecord from '../../models/WeatherRecord.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const newRecord = new WeatherRecord(req.body);
  const saved = await newRecord.save();
  res.json(saved);
});

router.get('/', async (req, res) => {
  const records = await WeatherRecord.find();
  res.json(records);
});

router.put('/:id', async (req, res) => {
  const updated = await WeatherRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await WeatherRecord.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
