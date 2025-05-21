const backendURL = "https://app-jvpd.onrender.com/api/weather";
const OPENWEATHER_API_KEY = "36ffc6ea6c048bb0fcc1752338facd48"; // Replace with your OpenWeatherMap key
const citySuggestions = [
  "New York", "London", "Tokyo", "Paris", "Mumbai",
  "Dubai", "Sydney", "Berlin", "Singapore", "Moscow", "Chicago"
];
const time = convertToLocalTime(data.date, data.timezone);

// populate datalist for suggestions
const suggestionList = document.getElementById("citySuggestions");
citySuggestions.forEach(city => {
  const opt = document.createElement("option");
  opt.value = city;
  suggestionList.appendChild(opt);
});

document.getElementById('weatherForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = document.getElementById('cityInput').value.trim();
  if (city) {
    fetchWeather(city, true);
  }
});

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

async function fetchWeather(city, updateMain = false) {
  try {
    const res = await fetch(`${backendURL}?city=${city}`);
    const data = await res.json();

    const time = convertToLocalTime(data.date, data.timezone);

    const html = `
      <h2>${data.location}</h2>
      <p><strong>Temperature:</strong> ${data.temperature} °C</p>
      <p><strong>Condition:</strong> ${data.condition}</p>
      <p><strong>Time:</strong> ${time}</p>
    `;

    if (updateMain) {
      document.getElementById('weatherDisplay').innerHTML = html;
      document.getElementById('weatherDisplay').classList.remove('hidden');
    } else {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = html;
      document.getElementById('topCities').appendChild(card);
    }

  } catch (error) {
    console.error("Weather fetch error:", error);
  }
}

function convertToLocalTime(dateString, timezoneOffset = 0) {
  const utcDate = new Date(dateString);
  const localTime = new Date(utcDate.getTime() + timezoneOffset * 1000);
  return localTime.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  });
}


function loadTopCities() {
  citySuggestions.slice(0, 7).forEach(city => fetchWeather(city, false));
}

