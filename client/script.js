const backendURL = "https://app-jvpd.onrender.com/api/weather";
const OPENWEATHER_API_KEY = "36ffc6ea6c048bb0fcc1752338facd48";
const RAPIDAPI_KEY = "7f735282efmshce0eccb67be20bdp13e90cjsn552d58dcfa0e";
const GOOGLE_MAPS_API_KEY = "AIzaSyAsMJvxZ0svpk_D5eSQqMeiap3_GLNPSoI";

const citySuggestions = [
  "New York", "London", "Tokyo", "Paris", "Mumbai",
  "Dubai", "Sydney", "Berlin", "Singapore", "Moscow", "Chicago"
];

const cityInput = document.getElementById("cityInput");
const datalist = document.getElementById("citySuggestions");

// 🔍 Autocomplete city suggestions from GeoDB
cityInput.addEventListener("input", async () => {
  const query = cityInput.value.trim();
  if (query.length < 2) return;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5&sort=-population`,
      options
    );
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      datalist.innerHTML = "";
      data.data.forEach(city => {
        const option = document.createElement("option");
        option.value = `${city.city}, ${city.countryCode}`;
        datalist.appendChild(option);
      });
    }
  } catch (err) {
    console.error("GeoDB autocomplete error:", err);
  }
});

// 📥 Handle form submission
document.getElementById('weatherForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city, true);
    fetchYouTubeVideos(city);
  }
});

// 🌍 Detect user location and show top cities
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const geoRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`);
      const geoData = await geoRes.json();
      fetchWeather(geoData.name, true);
    });
  }

  loadTopCities();
};

// 🌦️ Fetch weather and display in card
async function fetchWeather(city, updateMain = false) {
  try {
    const res = await fetch(`${backendURL}?city=${encodeURIComponent(city)}`);
    const data = await res.json();

    if (data.error) {
      showError(data.error);
      return;
    }

    // ⛔ Hide top cities when searching
    if (updateMain) {
      document.getElementById("topCities").style.display = "none";
      document.querySelector(".section-title").style.display = "none";
      document.querySelector(".subtitle").style.display = "none";
    }

    const iconURL = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    const imageURL = `https://source.unsplash.com/400x300/?city,${data.location}`;

    const currentHTML = `
      <div class="weather-card" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('${imageURL}')">
        <div class="overlay">
          <h2>${data.location}</h2>
          <img src="${iconURL}" alt="${data.condition}" />
          <p>🌡️ <strong>${data.temperature} °C</strong></p>
          <p>🌥️ <strong>${data.condition}</strong></p>
        </div>
      </div>
    `;

    if (updateMain) {
      document.getElementById('weatherDisplay').innerHTML = currentHTML;
      document.getElementById('weatherDisplay').classList.remove('hidden');
    }

    // 🕒 Hourly forecast (today only)
    const hourlyToday = data.forecast?.slice(0, 4).map(item => `
      <div class="forecast-card">
        <p><strong>${new Date(item.date).getHours()}:00</strong></p>
        <img src="https://openweathermap.org/img/wn/${item.icon}@2x.png" alt="${item.condition}" />
        <p>${Math.round(item.temp)} °C</p>
        <p>${item.condition}</p>
      </div>
    `).join("");

    // 📅 5-day forecast (skip first)
    const daily = data.forecast?.slice(1).map(day => `
      <div class="forecast-card">
        <p><strong>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</strong></p>
        <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.condition}" />
        <p>${Math.round(day.temp)} °C</p>
        <p>${day.condition}</p>
      </div>
    `).join("");

    document.getElementById("forecastDisplay").innerHTML = `
      <h3>Today's Hourly</h3>
      <div class="forecast-grid">${hourlyToday}</div>
      <h3>5-Day Forecast</h3>
      <div class="forecast-grid">${daily}</div>
    `;

    // 🗺️ Google Map
    const mapFrame = `
      <iframe
        width="100%"
        height="100%"
        style="border:0"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(data.location)}">
      </iframe>
    `;
    document.getElementById("mapDisplay").innerHTML = mapFrame;
    document.getElementById("mapDisplay").classList.remove("hidden");

  } catch (error) {
    console.error("Weather fetch error:", error);
    showError("❌ Unable to fetch weather. Please try again.");
  }
}

// 📹 Fetch YouTube Videos
async function fetchYouTubeVideos(city) {
  try {
    const res = await fetch(`https://app-jvpd.onrender.com/api/youtube?city=${encodeURIComponent(city)}`);
    const videos = await res.json();

    const container = document.getElementById("youtubeVideos");
    container.innerHTML = `
      <h3>YouTube Travel Videos</h3>
      <div class="youtube-section">
        ${videos.map(video => `
          <div class="yt-video">
            <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank">
              <img src="${video.thumbnail}" alt="${video.title}" />
              <p>${video.title}</p>
            </a>
          </div>
        `).join("")}
      </div>
    `;
  } catch (err) {
    console.error("YouTube fetch failed", err);
  }
}

// 🏙️ Load Top Cities
function loadTopCities() {
  document.getElementById("topCities").style.display = "grid";
  citySuggestions.slice(0, 7).forEach(city => fetchWeather(city, false));
}

// 🌗 Toggle dark mode
document.getElementById('themeToggle').addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

// ❌ Show error message
function showError(message) {
  document.getElementById('weatherDisplay').innerHTML = `<div class="error-msg">${message}</div>`;
  document.getElementById('forecastDisplay').innerHTML = "";
  document.getElementById('mapDisplay').innerHTML = "";
  document.getElementById('youtubeVideos').innerHTML = "";
}
