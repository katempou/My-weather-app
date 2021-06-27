let submitForm = document.querySelector("#city-form");
let buttonSearch = document.querySelector("#searchButton");
let buttonShow = document.querySelector("#currentLocation");

let now = new Date();
let newCurrentDate = document.querySelector("#outputDate");
function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  let thisHour = now.getHours();
  if (thisHour < 10) {
    thisHour = `0${thisHour}`;
  }
  let thisWeekday = days[now.getDay()];
  let thisMinutes = now.getMinutes();
  if (thisMinutes < 10) {
    thisMinutes = `0${thisMinutes}`;
  }
  return `Last updated:${thisWeekday}, ${thisHour}:${thisMinutes}`;
}
newCurrentDate.innerHTML = formatDate(new Date());

function formatDay(timestamp){
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  return days[day];
}
function displayForecast(response){
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML= `<div class="row">`;
  
  forecast.forEach(function(forecastDay, index){

    if( index < 6 ){
     forecastHTML = forecastHTML + `
                    <div class="col-2">
                        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
                        <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="" width="42"/>
                        <div class="weather-forecast-temperature">
                            <span class="weather-forecast-temperature-max">${Math.round(forecastDay.temp.max)}°</span>
                            <span class="weather-forecast-temperature-min">${Math.round(forecastDay.temp.min)}°</span>
                        </div>
                    </div>`;
                  }
  });
    forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForcast(coordinates){
  

  let apiKey = "ddf09ab1befaaaefd5bca7342d836c23";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function runTemp(response) {
  document.querySelector("#outputCity").innerHTML = response.data.name;
  let temperature = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector("#temperature");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let descriptionElement = document.querySelector("#description");
  let iconElement = document.querySelector("#icon");

  celsiusTemp = response.data.main.temp;
  currentTemp.innerHTML = `${temperature}`;
  humidity.innerHTML = `${response.data.main.humidity} %`;
  wind.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  descriptionElement.innerHTML= response.data.weather[0].description;
  iconElement.setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
  
  getForcast(response.data.coord);

}
function searchCity(city){
  let apiKey = "ddf09ab1befaaaefd5bca7342d836c23";
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(`${apiUrlCity}`).then(runTemp);
}
function enterCity(event) {
  event.preventDefault();
  let city = document.querySelector("#inputCity").value;
  searchCity(city);
}
submitForm.addEventListener("submit", enterCity);
buttonSearch.addEventListener("click", enterCity);
buttonShow.addEventListener("click", getPosition);

function showCurrentPosition(position) {
  let apiKey = "ddf09ab1befaaaefd5bca7342d836c23";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios.get(`${apiUrl}`).then(runTemp);
}
function getPosition(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(showCurrentPosition);
}

searchCity("New York");

