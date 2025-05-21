const backendURL = "https://app-jvpd.onrender.com/api/weather";

const topCities = ['London', 'New York', 'Tokyo', 'Paris', 'Mumbai', 'Sydney', 'Dubai'];

document.getElementById('weatherForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = document.getElementById('cityInput').value.trim();
  if (city) {
    fetchWeather(city, true);
  }
});

// On page load: use geolocation
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=‎36ffc6ea6c048bb0fcc1752338facd48`);
      const data = await res.json();
      fetchWeather(data.name, true);
    });
  }

  loadTopCities();
};

async function fetchWeather(city, updateMain = false) {
  try {
    const res = await fetch(`${backendURL}?city=${city}`);
    const data = await res.json();

    const time = convertToLocalTime(data.date, data.timezone); // Add timezone later

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
    console.error("Error fetching weather:", error);
  }
}

function convertToLocalTime(dateString, timezoneOffset = 0) {
  const utcDate = new Date(dateString);
  const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000);
  return localDate.toLocaleString('en-US', { timeZone: 'UTC' });
}

function loadTopCities() {
  topCities.forEach(city => fetchWeather(city, false));
}
