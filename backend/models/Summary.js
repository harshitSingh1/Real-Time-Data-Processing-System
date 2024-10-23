//backend\models\Summary.js
const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  city: String,
  temp: Number,
  feels_like: Number,
  temp_min: Number,
  temp_max: Number,
  pressure: Number,
  humidity: Number,
  visibility: Number,
  wind_speed: Number,
  wind_deg: Number,
  rain_1h: Number,
  clouds_all: Number,
  main: String,
  description: String,
  icon: String,
  date: { type: String, required: true }, // Store date in YYYY-MM-DD format
  time: { type: String, required: true }, // Store time in HH:mm:ss format
});

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);

module.exports = WeatherData;

