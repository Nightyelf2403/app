const backendURL = "https://app-jvpd.onrender.com/api/weather";
const OPENWEATHER_API_KEY = "36ffc6ea6c048bb0fcc1752338facd48";
const RAPIDAPI_KEY = "7f735282efmshce0eccb67be20bdp13e90cjsn552d58dcfa0e";
const citySuggestions = ["New York", "London", "Tokyo", "Paris", "Mumbai", "Dubai", "Sydney", "Berlin", "Singapore", "Moscow", "Chicago"];

const cityInput = document.getElementById("cityInput");
const datalist = document.getElementById("citySuggestions");

// Fetch GeoDB city suggestions as you type
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
    const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5`, options);
    const data = await response.json();

    datalist.innerHTML = "";
    data.data.forEach(city => {
      const option = document.createElement("option");
      option.value = city.city;
      datalist.appendChild(option);
    });
  } catch (err) {
    console.error("GeoDB autocomplete error:", err);
  }
});

document.getElementById('weatherForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
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
    const iconURL = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    const imageURL = `https://source.unsplash.com/400x300/?city,${data.location}`;

    const html = `
      <div class="weather-card" style="background-image: url('${imageURL}');">
        <div class="overlay">
          <h2>${data.location}</h2>
          <img src="${iconURL}" alt="${data.condition}" />
          <p><strong>Temperature:</strong> ${data.temperature} °C</p>
          <p><strong>Condition:</strong> ${data.condition}</p>
          <p><strong>Time:</strong> ${time}</p>
        </div>
      </div>
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
  });
}

function loadTopCities() {
  citySuggestions.slice(0, 7).forEach(city => fetchWeather(city, false));
}
