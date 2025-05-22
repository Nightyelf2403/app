const backendURL = "https://app-jvpd.onrender.com/api/weather";
const OPENWEATHER_API_KEY = "36ffc6ea6c048bb0fcc1752338facd48";
const RAPIDAPI_KEY = "7f735282efmshce0eccb67be20bdp13e90cjsn552d58dcfa0e";
const citySuggestions = ["New York", "London", "Tokyo", "Paris", "Mumbai", "Dubai", "Sydney", "Berlin", "Singapore", "Moscow", "Chicago"];

const cityInput = document.getElementById("cityInput");
const datalist = document.getElementById("citySuggestions");

// Autocomplete from GeoDB
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
    const res = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5&sort=-population`, options);
    const data = await res.json();
    datalist.innerHTML = "";
    data.data.forEach(city => {
      const option = document.createElement("option");
      option.value = `${city.city}, ${city.countryCode}`;
      datalist.appendChild(option);
    });
  } catch (err) {
    console.error("GeoDB autocomplete error:", err);
  }
});

// Handle form submission
document.getElementById("weatherForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) fetchWeather(city, true);
});

// On load, show top cities
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`);
      const data = await res.json();
      fetchWeather(data.name, true);
    });
  }
  loadTopCities();
};

// Fetch and display weather
async function fetchWeather(city, updateMain = false) {
  try {
    const res = await fetch(`${backendURL}?city=${encodeURIComponent(city)}`);
    const data = await res.json();

    if (data.error) return showError(data.error);

    const iconURL = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    const imageURL = `https://source.unsplash.com/400x300/?${data.location}`;

    const html = `
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
      document.getElementById("weatherDisplay").innerHTML = html;
      document.getElementById("weatherDisplay").classList.remove("hidden");
      document.getElementById("topCities").innerHTML = "";
    } else {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h3>${data.location}</h3><p>${data.temperature} °C</p><p>${data.condition}</p>`;
      card.addEventListener("click", () => fetchWeather(city, true));
      document.getElementById("topCities").appendChild(card);
    }

    // Forecast (5-day)
    if (updateMain && data.forecast) {
      const forecastHTML = data.forecast.map(day => `
        <div class="forecast-card">
          <p><strong>${new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}</strong></p>
          <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" />
          <p>${Math.round(day.temp)} °C</p>
          <p>${day.condition}</p>
        </div>
      `).join("");
      document.getElementById("forecastDisplay").innerHTML = `
        <h3>5-Day Forecast</h3>
        <div class="forecast-grid">${forecastHTML}</div>
      `;
    }

    // YouTube
    fetchYouTubeVideos(data.location);

    // Map
    const mapURL = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAsMJvxZ0svpk_D5eSQqMeiap3_GLNPSoI&q=${encodeURIComponent(city)}`;
    document.getElementById("mapDisplay").innerHTML = `<iframe width="100%" height="100%" frameborder="0" src="${mapURL}" allowfullscreen></iframe>`;
    document.getElementById("mapDisplay").classList.remove("hidden");

  } catch (err) {
    showError("Could not fetch weather.");
    console.error("Weather fetch error:", err);
  }
}

// Load hourly forecast if supported later (placeholder)
function displayHourlyForecast(data) {
  document.getElementById("hourlyDisplay").innerHTML = "";
}

// Load top 6 cities
function loadTopCities() {
  citySuggestions.slice(0, 6).forEach(city => fetchWeather(city, false));
}

// Fetch YouTube videos
function fetchYouTubeVideos(city) {
  fetch(`https://app-jvpd.onrender.com/api/youtube?city=${encodeURIComponent(city)}`)
    .then(res => res.json())
    .then(videos => {
      document.getElementById("youtubeVideos").innerHTML = videos.map(video => `
        <div class="yt-video">
          <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank">
            <img src="${video.thumbnail}" alt="${video.title}" />
            <p>${video.title}</p>
          </a>
        </div>
      `).join("");
    })
    .catch(err => {
      console.error("YouTube API error", err);
    });
}

// Dark mode toggle
document.getElementById("themeToggle").addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

// Show error
function showError(msg) {
  document.getElementById("weatherDisplay").innerHTML = `<div class="error-msg">${msg}</div>`;
  document.getElementById("forecastDisplay").innerHTML = "";
  document.getElementById("hourlyDisplay").innerHTML = "";
  document.getElementById("mapDisplay").classList.add("hidden");
  document.getElementById("youtubeVideos").innerHTML = "";
}
