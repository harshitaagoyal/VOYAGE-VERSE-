const apiKey = "93d9bb8ea3869a8dbb9ffffefec245bc";

document.getElementById("getWeather").addEventListener("click", () => {
    const city = document.getElementById("city").value.trim();
    if (city) {
        getWeatherForecast(city);
    } else {
        alert("Please enter a city name!");
    }
});

async function getWeatherForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        alert(error.message);
    }
}

function displayForecast(data) {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";
    const forecastList = data.list.filter((_, index) => index % 8 === 0);

    forecastList.forEach(item => {
        const card = document.createElement("div");
        card.className = "weather-card";
        card.innerHTML = `
            <h3>${new Date(item.dt_txt).toLocaleDateString()}</h3>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather icon">
            <p>${item.weather[0].description}</p>
            <p>Temp: ${item.main.temp} °C</p>
            <p>Humidity: ${item.main.humidity}%</p>
        `;
        forecastContainer.appendChild(card);
    });
}
