"use strict";

const API_KEY = "enter_api_key_here";

const ICONS = [
  'icons/01d@2x.png',
  'icons/01n@2x.png',
  'icons/02d@2x.png',
  'icons/02n@2x.png',
  'icons/03d@2x.png',
  'icons/03n@2x.png',
  'icons/04d@2x.png',
  'icons/04n@2x.png',
  'icons/09d@2x.png',
  'icons/09n@2x.png',
  'icons/10d@2x.png',
  'icons/10n@2x.png',
  'icons/11d@2x.png',
  'icons/11n@2x.png',
  'icons/13d@2x.png',
  'icons/13n@2x.png',
  'icons/50d@2x.png',
  'icons/50n@2x.png'
];

function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      function (error) {
        reject(error);
      }
    );
  });
}

async function getWeatherData() {
  const curPos = await getPosition();
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${curPos.lat}&lon=${curPos.lon}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();

  const weatherData = {};
  weatherData.main = data.weather[0].main;
  weatherData.description = data.weather[0].description;
  weatherData.icon = data.weather[0].icon;
  weatherData.country = data.sys.country;
  weatherData.location = data.name;
  weatherData.temp = data.main.temp;
  weatherData.tempLike = data.main.feels_like;
  weatherData.pressure = data.main.pressure;
  weatherData.humidity = data.main.humidity;
  weatherData.wind = data.wind.speed;
  weatherData.dataCalcTime = data.dt;
  weatherData.timezone = data.timezone;

  renderWeatherData(weatherData);
}

getWeatherData();

function renderWeatherData(data) {
  const titleElement = document.querySelector(".main_title");
  titleElement.textContent = firstLetterToUpperCase(data.description);

  const iconElement = document.querySelector(".icon");
  if (iconElement.firstChild) {
    iconElement.firstChild.remove();
  }
  const imgElement = document.createElement("img");
  imgElement.src = `icons/${data.icon}@2x.png`;
  iconElement.append(imgElement);

  const locationElement = document.querySelector(".location");
  locationElement.textContent = `Location: ${data.country} ${data.location}`;

  const tempElement = document.querySelector(".temperature");
  tempElement.textContent = `${data.temp} \u00B0C`;

  const tempLikeElement = document.querySelector(".temperature_like");
  tempLikeElement.textContent = `Feels like: ${data.tempLike} \u00B0C`;

  const humidityElement = document.querySelector(".humidity");
  humidityElement.textContent = `Humidity: ${data.humidity} %`;

  const pressureElement = document.querySelector(".pressure");
  pressureElement.textContent = `Pressure: ${data.pressure} hPa`;

  const windElement = document.querySelector(".wind");
  windElement.textContent = `Wind: ${data.wind} km/h`;

  const lastUpdateElement = document.querySelector(".last_update");
  const time = (data.dataCalcTime + data.timezone) * 1000;
  const date = new Date(time);
  lastUpdateElement.textContent = `Last update: ${date.toUTCString()}`;
}

function firstLetterToUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const updateBtnElement = document.querySelector(".update_btn");
updateBtnElement.addEventListener('click', () => {
  getWeatherData();
});
