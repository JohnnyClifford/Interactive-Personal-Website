const cities = {
    whistler: { name: "Whistler", lat: 50.1163, lon: -122.9574 },
    squamish: { name: "Squamish", lat: 49.7015, lon: -123.1589 },
    vancouver: { name: "Vancouver", lat: 49.2827, lon: -123.1207 },
    pemberton: { name: "Pemberton", lat: 50.3167, lon: -122.8028 }
};

let currentCity = "whistler";

async function fetchWeather(cityId) {
    const city = cities[cityId];
    if (!city) return;
    
    currentCity = cityId;
    
    updateActiveButton(cityId);
    
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        const temperature = data.current_weather.temperature;
        const windspeed = data.current_weather.windspeed;
        
        document.getElementById('weather-display').innerHTML = `
            <p style="font-size: 2rem; font-weight: bold;">${temperature}°C</p>
            <p>Wind Speed: ${windspeed} km/h</p>
            <p style="font-size: 0.9rem; color: #666;">${city.name}, BC • Updated: ${new Date().toLocaleTimeString()}</p>
        `;
        
    } catch (error) {
        document.getElementById('weather-display').innerHTML = `
            <p style="color: red;">Error loading weather data. Please try again.</p>
        `;
    }
}

function updateActiveButton(activeCityId) {
    const buttons = document.querySelectorAll('.btn-city');
    buttons.forEach(button => {
        const buttonCity = button.getAttribute('data-city');
        if (buttonCity === activeCityId) {
            button.classList.add('active-city');
        } else {
            button.classList.remove('active-city');
        }
    });
}

function refreshWeather() {
    fetchWeather(currentCity);
}

function setupCityButtons() {
    const buttons = document.querySelectorAll('.btn-city');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const cityId = this.getAttribute('data-city');
            fetchWeather(cityId);
        });
    });
    
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshWeather);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupCityButtons();
    fetchWeather("whistler");
});