const backendURL = "https://app-jvpd.onrender.com/api/weather";
const youtubeURL = "https://app-jvpd.onrender.com/api/youtube";
const OPENWEATHER_API_KEY = "36ffc6ea6c048bb0fcc1752338facd48";
const RAPIDAPI_KEY = "7f735282efmshce0eccb67be20bdp13e90cjsn552d58dcfa0e";
const GOOGLE_MAPS_API_KEY = "AIzaSyAsMJvxZ0svpk_D5eSQqMeiap3_GLNPSoI";

const citySuggestions = [
  "New York", "London", "Tokyo", "Paris", "Mumbai",
  "Dubai", "Sydney", "Berlin", "Singapore", "Moscow", "Chicago"
];

const cityInput = document.getElementById("cityInput");
const datalist = document.getElementById("citySuggestions");

// Autocomplete city suggestions
cityInput.addEventListener("input", async () => {
  const query = cityInput.value.trim();
  if (query.length < 2) return;

  try {
    const res = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5&sort=-population`, {
      method: "GET",
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
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

// Search submit
document.getElementById('weatherForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    document.getElementById("topCities").innerHTML = "";
    await fetchWeather(city, true);
    await fetchYouTubeVideos(city);
    showMap(city);
  }
});

// Load top cities on homepage
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`);
      const data = await res.json();
      fetchWeather(data.name, true);
      fetchYouTubeVideos(data.name);
      showMap(data.name);
    });
  }

  citySuggestions.slice(0, 6).forEach(city => fetchWeather(city, false));
};

// Fetch weather (current + forecast)
async function fetchWeather(city, updateMain) {
  try {
    const res = await fetch(`${backendURL}?city=${encodeURIComponent(city)}`);
    const data = await res.json();

    if (data.error) {
      showError(data.error);
      return;
    }

    const iconURL = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    const imageURL = `https://source.unsplash.com/400x300/?${data.location},city`;

    const html = `
      <div class="weather-card" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('${imageURL}')">
        <div class="overlay">
          <h2>${data.location}</h2>
          <img src="${iconURL}" alt="${data.condition}" />
          <p><strong>${data.temperature} °C</strong></p>
          <p>${data.condition}</p>
        </div>
      </div>
    `;

    if (updateMain) {
      document.getElementById('weatherDisplay').innerHTML = html;
      document.getElementById('weatherDisplay').classList.remove('hidden');

      renderHourlyForecast(data.hourly || []);
      renderForecast(data.forecast || []);
    } else {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = html;
      card.addEventListener("click", async () => {
        cityInput.value = data.location;
        await fetchWeather(data.location, true);
        await fetchYouTubeVideos(data.location);
        showMap(data.location);
        document.getElementById("topCities").innerHTML = "";
      });
      document.getElementById("topCities").appendChild(card);
    }
  } catch (err) {
    console.error("Weather fetch failed:", err);
    showError("Unable to fetch weather data.");
  }
}

// Render 5-day forecast
function renderForecast(forecast) {
  if (!forecast.length) return;

  const forecastHTML = forecast.map(f => `
    <div class="forecast-card">
      <p><strong>${new Date(f.date).toLocaleDateString('en-US', { weekday: 'short' })}</strong></p>
      <img src="https://openweathermap.org/img/wn/${f.icon}@2x.png" alt="${f.condition}" />
      <p>${Math.round(f.temp)} °C</p>
      <p>${f.condition}</p>
    </div>
  `).join("");

  document.getElementById("forecastDisplay").innerHTML += `
    <h3>5-Day Forecast</h3>
    <div class="forecast-grid">${forecastHTML}</div>
  `;
}

// Render hourly forecast
function renderHourlyForecast(hourly) {
  if (!hourly.length) return;

  const hourlyHTML = hourly.map(h => `
    <div class="forecast-card">
      <p><strong>${new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></p>
      <img src="https://openweathermap.org/img/wn/${h.icon}@2x.png" alt="${h.condition}" />
      <p>${Math.round(h.temp)} °C</p>
      <p>${h.condition}</p>
    </div>
  `).join("");

  document.getElementById("forecastDisplay").innerHTML = `
    <h3>Today's Hourly</h3>
    <div class="forecast-grid">${hourlyHTML}</div>
  `;
}

// Fetch YouTube videos
async function fetchYouTubeVideos(city) {
  try {
    const res = await fetch(`${youtubeURL}?city=${city}`);
    const videos = await res.json();

    const container = document.getElementById("youtubeVideos");
    container.innerHTML = "<h3>YouTube Travel Videos</h3>" + videos.map(v => `
      <div class="yt-video">
        <a href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank">
          <img src="${v.thumbnail}" alt="${v.title}" />
          <p>${v.title}</p>
        </a>
      </div>
    `).join("");
  } catch (err) {
    console.error("YouTube error:", err);
  }
}

// Show Google Map
function showMap(city) {
  const mapURL = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(city)}`;
  document.getElementById("mapDisplay").classList.remove("hidden");
  document.getElementById("mapDisplay").innerHTML = `
    <iframe width="100%" height="300" frameborder="0" style="border:0" 
      src="${mapURL}" allowfullscreen></iframe>
  `;
}

// Theme toggle
document.getElementById('themeToggle').addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

// Error handler
function showError(msg) {
  document.getElementById("weatherDisplay").innerHTML = `<div class="error-msg">${msg}</div>`;
  document.getElementById("forecastDisplay").innerHTML = "";
  document.getElementById("youtubeVideos").innerHTML = "";
  document.getElementById("mapDisplay").classList.add("hidden");
}
