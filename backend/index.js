//backend\index.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const WeatherData = require('./models/Summary'); // Ensure this path is correct

const app = express();
const PORT = process.env.PORT || 5000;

// Environment variable for MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://sharshitsingh007:bM8KiHWQvqf1OVbd@cluster0.j9ldg.mongodb.net/rulesDB?retryWrites=true&w=majority";
const API_KEY = process.env.OPENWEATHERMAP_API_KEY || "9b23545e9003f6bdb15e1e1951fa4200";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Weather Monitoring System is running');
});

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const fetchAndSaveWeatherData = async (city) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    const data = response.data;

    // Convert temperatures from Kelvin to Celsius
    const kelvinToCelsius = (temp) => temp - 273.15;

    const currentTemp = kelvinToCelsius(data.main.temp);
    const currentFeelsLike = kelvinToCelsius(data.main.feels_like);
    const currentMinTemp = kelvinToCelsius(data.main.temp_min);
    const currentMaxTemp = kelvinToCelsius(data.main.temp_max);

    const currentDateTime = new Date(data.dt * 1000); // Convert Unix timestamp to Date object
    const currentDate = currentDateTime.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
    const currentTime = currentDateTime.toTimeString().split(' ')[0]; // Get the time in HH:mm:ss format

    // Find or update the existing weather data for the city and date
    const weatherData = await WeatherData.findOneAndUpdate(
      { city: data.name, date: currentDate },
      {
        $set: {
          temp: currentTemp,
          feels_like: currentFeelsLike,
          pressure: data.main.pressure,
          humidity: data.main.humidity,
          visibility: data.visibility,
          wind_speed: data.wind.speed,
          wind_deg: data.wind.deg,
          rain_1h: data.rain ? data.rain['1h'] : 0,
          clouds_all: data.clouds.all,
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          time: currentTime
        },
        $max: {
          temp_max: currentMaxTemp
        },
        $min: {
          temp_min: currentMinTemp
        },
        $setOnInsert: {
          date: currentDate // Set date only if it's a new document
        }
      },
      { upsert: true, new: true } // upsert creates a new document if none is found
    );

    console.log('Weather data updated:', city, currentDate);
  } catch (error) {
    console.error('Error fetching or saving data:', error);
  }
};


// Fetch weather data every 5 minutes for each city
setInterval(() => {
  cities.forEach(city => fetchAndSaveWeatherData(city));
}, 5* 60 * 1000);

app.get('/api/weather-summary', async (req, res) => {
  try {
    const summaries = await WeatherData.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: { $dateFromString: { dateString: "$date" } } },
            month: { $month: { $dateFromString: { dateString: "$date" } } },
            year: { $year: { $dateFromString: { dateString: "$date" } } },
            city: "$city"
          },
          averageTemp: { $avg: "$temp" },
          maxTemp: { $max: "$temp_max" },
          minTemp: { $min: "$temp_min" },
          averageFeelsLike: { $avg: "$feels_like" },
          dominantWeather: { $first: "$main" },
          averagePressure: { $avg: "$pressure" },
          averageHumidity: { $avg: "$humidity" },
          averageVisibility: { $avg: "$visibility" },
          averageWindSpeed: { $avg: "$wind_speed" },
          averageWindDeg: { $avg: "$wind_deg" },
          totalRain: { $sum: "$rain_1h" },
          averageClouds: { $avg: "$clouds_all" },
          description: { $first: "$description" },
          icon: { $first: "$icon" },
          time: { $first: "$time" }  // Include time in the projection
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day"
            }
          },
          city: "$_id.city",
          averageTemp: 1,
          maxTemp: 1,
          minTemp: 1,
          averageFeelsLike: 1,
          dominantWeather: 1,
          averagePressure: 1,
          averageHumidity: 1,
          averageVisibility: 1,
          averageWindSpeed: 1,
          averageWindDeg: 1,
          totalRain: 1,
          averageClouds: 1,
          description: 1,
          icon: 1,
          time: 1  // Include time in the projection
        }
      }
    ]);
    console.log("Summaries fetched from DB:", summaries);
    res.json(summaries);
  } catch (error) {
    console.error('Error fetching weather summary:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});


app.get('/api/alerts', (req, res) => {
  res.json(alertList);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
