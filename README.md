# 🌤️ Weather App

A beautifully responsive, full-stack weather application built by **Lalith Aditya Chunduri** using **HTML, CSS, JavaScript, Express (Node.js), MongoDB**, and **OpenWeatherMap API**.

---

## 💡 Project Idea

The Weather App was designed to deliver real-time weather updates for any city worldwide, with a focus on:

- Clean and attractive UI (inspired by Apple Weather)
- Real-time API integration
- Responsive layout across all devices (phone, tablet, desktop)
- City search with smart autocomplete (GeoDB Cities API)
- Dark mode toggle and dynamic city cards

---

## 🏗️ Project Structure

```
📦 weather-app/
├── client/                # Frontend files (HTML, CSS, JS)
│   ├── index.html         # Main UI page
│   ├── style.css          # Styles with dark/light mode and responsive design
│   └── script.js          # Handles fetch, display, city search, and dynamic rendering
│
├── server/                # Backend (Node.js + Express)
│   ├── index.js           # Weather API routes and OpenWeatherMap integration
│   └── .env               # Secure API key storage (OPENWEATHER_API_KEY)
│
├── package.json           # Node dependencies and build metadata
└── README.md              # You’re reading it!
```

---

## 🔧 Technologies Used

- **Frontend**: HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **APIs**:
  - [OpenWeatherMap](https://openweathermap.org/api) – real-time weather
  - [GeoDB Cities](https://rapidapi.com/wirefreethought/api/geodb-cities) – smart city search
- **Database**: MongoDB Atlas (optional: stores queried weather data)
- **Hosting**: 
  - Frontend via [Vercel](https://vercel.com)
  - Backend via [Render](https://render.com)

---

## 🌍 Features

- 🔎 **Search** weather by city (with auto-complete)
- 📍 **Auto-detect location** using Geolocation API
- 🌆 **Top cities** showcase (Tokyo, Paris, NY, etc.)
- 🎨 **Dynamic UI** with Unsplash city backgrounds & weather icons
- 🌗 **Dark/light mode** toggle
- 📱 **Fully responsive design** (mobile to desktop)
- ❌ Removed confusing timezone-based clocks

---

## ⚙️ How It Works

1. **Frontend** allows user to:
   - Search for a city → calls backend with `/api/weather?city=...`
   - View top 7 cities instantly on load
   - Auto-fetch weather using geolocation

2. **Backend** (Express API):
   - Accepts city name
   - Calls OpenWeatherMap API
   - Returns JSON with city name, temperature, condition, icon, and timezone

3. **Frontend UI**:
   - Renders glassy cards with icons, emojis, and live weather
   - Uses Unsplash for dynamic background images per city

---

## 🔑 Environment Variables (Backend)

Create a `.env` file in `/server/` with:

```
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

---

## 🚀 Live Deployment

- **Frontend**: [https://app-tawny-eta.vercel.app](https://app-tawny-eta.vercel.app)
- **Backend**: [https://app-jvpd.onrender.com](https://app-jvpd.onrender.com)

---

## 🧠 Built With Passion

This project was developed as part of a technical assessment & learning exercise, blending frontend elegance with backend API architecture.

> “Developed with ❤️ by Lalith Aditya Chunduri”

---

## 📅 Last Updated

May 21, 2025

