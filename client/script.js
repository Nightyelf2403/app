// public/script.js
const backend = "https://app-jvpd.onrender.com/api";


document.getElementById("themeToggle").addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

document.getElementById("weatherForm").addEventListener("submit", async e => {
  e.preventDefault();
  const city = document.getElementById("cityInput").value;
  const res = await fetch(`${backend}/weather?city=${encodeURIComponent(city)}`);
  const data = await res.json();
  displayWeather(data);
});

function displayWeather(data) {
  const weather = document.getElementById("weatherDisplay");
  weather.classList.remove("hidden");
  weather.innerHTML = `
    <h2>${data.location}</h2>
    <p>${data.condition}, ${data.temperature}°C</p>
    <img src="https://openweathermap.org/img/wn/${data.icon}@2x.png" />
  `;
}
