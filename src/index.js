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


function displayForecast(){
  let forecastElement = document.querySelector("forecast");

  let forecastHTML= `<div class="row">`;
  let days= ["Mon","Tue","Wed","Thu","Fri"];
  days.forEach(function(day){

  forecastHTML = forecastHTML + `
                    <div class="col-2">
                        <div class="weather-forecast-date">${day}</div>
                        <img src="http://openweathermap.org/img/wn/03d@2x.png" alt="" width="42"/>
                        <div class="weather-forecast-temperature">
                            <span class="weather-forecast-temperature-max">18°</span>
                            <span class="weather-forecast-temperature-min">12°</span>
                        </div>
                    </div>`;
  });
    forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML=forecastHTML;
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
  currentTemp.innerHTML = `${temperature} ℃`;
  humidity.innerHTML = `${response.data.main.humidity} %`;
  wind.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  descriptionElement.innerHTML= response.data.weather[0].description;
  iconElement.setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function enterCity(event) {
    let apiKey = "ddf09ab1befaaaefd5bca7342d836c23";

  let city = document.querySelector("#inputCity").value;
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(`${apiUrlCity}`).then(runTemp);
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
function showFahrenheitTemp(event){
  event.preventDefault();
  let currentTemp = document.querySelector("#temperature");
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  let fahrenheitTemp= (celsiusTemp * 9) / 5 + 32;
  currentTemp.innerHTML= Math.round(fahrenheitTemp) ;
}

function showCelsiusTemp(event){
  event.preventDefault();
  let currentTemp = document.querySelector("#temperature");
  fahrenheit.classList.remove("active");
  celsius.classList.add("active");
  currentTemp.innerHTML= Math.round(celsiusTemp) ;
}

let celsiusTemp= null;
let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", showFahrenheitTemp);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", showCelsiusTemp);

enterCity("New York");
displayForecast();