// 📁 client/script.js
async function fetchWeather() {
  const city = document.getElementById('cityInput').value;
  if (!city) return alert("Enter a city name");

  const res = await fetch(`https://app-jvpd.onrender.com/api/weather?city=${city}`);
  const data = await res.json();

  document.getElementById('weatherDisplay').innerHTML = `
    <h3>${data.location}</h3>
    <p>Temperature: ${data.temperature} °C</p>
    <p>Condition: ${data.condition}</p>
    <p>Time: ${new Date(data.date).toLocaleString()}</p>
  `;
}


