import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import weatherRoutes from "./routes/api/weather.js";
import recordsRoutes from "./routes/api/records.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/weather", weatherRoutes);
app.use("/api/records", recordsRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
}).catch(err => console.error("❌ MongoDB connection error:", err));
