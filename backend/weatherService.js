//backend\weatherService.js
const axios = require('axios');
const { convertKelvinToCelsius } = require('./utils');
const API_KEY = "9b23545e9003f6bdb15e1e1951fa4200";
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const LOCATIONS = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

const fetchWeatherData = async (city) => {
  try {
    console.log(API_KEY)
    const response = await axios.get(`${BASE_URL}?q=${city}&appid=${API_KEY}`);
    const data = response.data;
    const tempC = convertKelvinToCelsius(data.main.temp);
    const feelsLikeC = convertKelvinToCelsius(data.main.feels_like);
    return {
      city,
      main: data.weather[0].main,
      temp: tempC,
      feels_like: feelsLikeC,
      dt: data.dt,
    };
  } catch (error) {
    console.error(`Error fetching weather data for ${city}:`, error);
    return null;
  }
};

const fetchAllWeatherData = async () => {
  const weatherData = await Promise.all(LOCATIONS.map(fetchWeatherData));
  return weatherData.filter(data => data !== null);
};

module.exports = { fetchAllWeatherData };
