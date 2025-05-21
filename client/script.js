document.getElementById('weatherForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const city = document.getElementById('cityInput').value.trim();
  if (!city) return;

  try {
    const res = await fetch(`https://app-jvpd.onrender.com/api/weather?city=${city}`);
    const data = await res.json();

    document.getElementById('weatherDisplay').innerHTML = `
      <h2>${data.location}</h2>
      <p><strong>Temperature:</strong> ${data.temperature} °C</p>
      <p><strong>Condition:</strong> ${data.condition}</p>
      <p><strong>Time:</strong> ${new Date(data.date).toLocaleString()}</p>
    `;
    document.getElementById('weatherDisplay').classList.remove('hidden');
  } catch (error) {
    alert('Error fetching weather data. Please try again.');
    console.error(error);
  }
});
