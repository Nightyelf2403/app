import express from "express";
import WeatherRecord from "../../models/WeatherRecord.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { location, date, temperature, condition, notes } = req.body;
    if (!location || !date) return res.status(400).json({ error: "Location and date are required." });

    const saved = await new WeatherRecord({ location, date, temperature, condition, notes }).save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: "Create failed", details: err });
  }
});

router.get("/", async (req, res) => {
  try {
    const records = await WeatherRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Read failed" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await WeatherRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await WeatherRecord.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
