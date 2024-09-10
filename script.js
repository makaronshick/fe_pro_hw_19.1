"use strict";

const API_KEY = "9e54f1371d244060336ff59180ed5458";

// PR comment:
//юзер може і заборонити місцеположення. програма має тоді щось "сказати", а не завалитися)
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

  const weatherData = {
    main: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    country: data.sys.country,
    location: data.name,
    temp: data.main.temp,
    tempLike: data.main.feels_like,
    pressure: data.main.pressure,
    humidity: data.main.humidity,
    wind: data.wind.speed,
    dataCalcTime: data.dt,
    timezone: data.timezone,
  };

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
