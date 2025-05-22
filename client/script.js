const backendURL = "https://app-jvpd.onrender.com/api/weather";
const youtubeAPI = "https://app-jvpd.onrender.com/api/youtube";
const OPENWEATHER_API_KEY = "36ffc6ea6c048bb0fcc1752338facd48";
const RAPIDAPI_KEY = "7f735282efmshce0eccb67be20bdp13e90cjsn552d58dcfa0e";

const citySuggestions = [
  "New York", "London", "Tokyo", "Paris", "Mumbai",
  "Dubai", "Sydney", "Berlin", "Singapore", "Moscow", "Chicago"
];

const cityInput = document.getElementById("cityInput");
const datalist = document.getElementById("citySuggestions");
const weatherDisplay = document.getElementById("weatherDisplay");
const forecastDisplay = document.getElementById("forecastDisplay");
const youtubeSection = document.getElementById("youtubeVideos");
const mapDisplay = document.getElementById("mapDisplay");
const topCitiesSection = document.getElementById("topCities");

// 🔍 Autocomplete city suggestions
cityInput.addEventListener("input", async () => {
  const query = cityInput.value.trim();
  if (query.length < 2) return;

  try {
    const res = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5&sort=-population`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
      }
    });
    const data = await res.json();

    datalist.innerHTML = "";
    data.data.forEach(city => {
      const option = document.createElement("option");
      option.value = `${city.city}, ${city.countryCode}`;
      datalist.appendChild(option);
    });
  } catch (err) {
    console.error("Autocomplete error:", err);
  }
});

// 📥 Handle form submit
document.getElementById("weatherForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    showCityWeather(city);
  }
});

// 🌗 Dark mode toggle
document.getElementById("themeToggle").addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

// 🏙️ Load homepage top cities
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`);
      const data = await res.json();
      showCityWeather(data.name);
    });
  }
  loadTopCities();
};

// 🔝 Load top cities (only on homepage)
function loadTopCities() {
  topCitiesSection.innerHTML = "";
  citySuggestions.slice(0, 7).forEach(async city => {
    const res = await fetch(`${backendURL}?city=${encodeURIComponent(city)}`);
    const data = await res.json();
    const iconURL = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${data.location}</h3>
      <img src="${iconURL}" alt="${data.condition}" />
      <p><strong>${data.temperature} °C</strong></p>
      <p>${data.condition}</p>
    `;
    card.onclick = () => showCityWeather(data.location);
    topCitiesSection.appendChild(card);
  });
}

// 🌐 Show searched or clicked city
async function showCityWeather(city) {
  try {
    const res = await fetch(`${backendURL}?city=${encodeURIComponent(city)}`);
    const data = await res.json();

    if (data.error) {
      showError(data.error);
      return;
    }

    const iconURL = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    const imageURL = `https://source.unsplash.com/400x300/?city,${data.location}`;

    weatherDisplay.innerHTML = `
      <div class="weather-card" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${imageURL}')">
        <div class="overlay">
          <h2>${data.location}</h2>
          <img src="${iconURL}" alt="${data.condition}" />
          <p><strong>🌡️ ${data.temperature} °C</strong></p>
          <p><strong>🌥️ ${data.condition}</strong></p>
        </div>
      </div>
    `;

    // 🕒 Hourly Forecast
    const hourlyHTML = (data.hourly || []).slice(0, 6).map(h => `
      <div class="forecast-card">
        <p>${new Date(h.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
        <img src="https://openweathermap.org/img/wn/${h.weather[0].icon}@2x.png" alt="${h.weather[0].description}" />
        <p>${Math.round(h.temp)} °C</p>
        <p>${h.weather[0].description}</p>
      </div>
    `).join("");

    // 📆 5-Day Forecast
    const dailyHTML = (data.forecast || []).map(day => `
      <div class="forecast-card">
        <p>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
        <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.condition}" />
        <p>${Math.round(day.temp)} °C</p>
        <p>${day.condition}</p>
      </div>
    `).join("");

    forecastDisplay.innerHTML = `
      <h3>Today's Hourly</h3>
      <div class="forecast-grid">${hourlyHTML}</div>
      <h3>5-Day Forecast</h3>
      <div class="forecast-grid">${dailyHTML}</div>
    `;

    // 🎥 YouTube Travel Videos
    const ytRes = await fetch(`${youtubeAPI}?city=${encodeURIComponent(city)}`);
    const ytData = await ytRes.json();
    youtubeSection.innerHTML = ytData.map(v => `
      <div class="yt-video">
        <a href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank">
          <img src="${v.thumbnail}" />
          <p>${v.title}</p>
        </a>
      </div>
    `).join("");

    // 🗺️ Google Map
    mapDisplay.innerHTML = `
      <iframe width="100%" height="300" style="border:0" loading="lazy" allowfullscreen
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAsMJvxZ0svpk_D5eSQqMeiap3_GLNPSoI&q=${encodeURIComponent(city)}">
      </iframe>
    `;

    weatherDisplay.classList.remove("hidden");
    mapDisplay.classList.remove("hidden");
    youtubeSection.classList.remove("hidden");
    forecastDisplay.classList.remove("hidden");
    topCitiesSection.innerHTML = ""; // hide homepage cities after search

  } catch (error) {
    console.error("Fetch failed:", error);
    showError("❌ Unable to fetch weather. Try again.");
  }
}

// ❌ Error handler
function showError(message) {
  weatherDisplay.innerHTML = `<div class="error-msg">${message}</div>`;
  forecastDisplay.innerHTML = "";
  mapDisplay.innerHTML = "";
  youtubeSection.innerHTML = "";
}
