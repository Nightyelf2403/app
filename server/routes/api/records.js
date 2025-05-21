app.post("/api/records", async (req, res) => {
  const { location, date, temperature, condition, notes } = req.body;
  if (!location || !date || !temperature || !condition) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const record = new WeatherRecord({ location, date, temperature, condition, notes });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: "Error saving record." });
  }
});
