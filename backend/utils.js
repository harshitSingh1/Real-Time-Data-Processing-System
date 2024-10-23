//backend\utils.js
const convertKelvinToCelsius = (kelvin) => kelvin - 273.15;
const getDailyWeatherSummary = (weatherData) => {
  // Assuming weatherData is an array of weather data for the day
  let totalTemp = 0;
  let maxTemp = -Infinity;
  let minTemp = Infinity;
  const conditionCount = {};

  weatherData.forEach(data => {
    totalTemp += data.temp;
    if (data.temp > maxTemp) maxTemp = data.temp;
    if (data.temp < minTemp) minTemp = data.temp;

    if (conditionCount[data.main]) {
      conditionCount[data.main]++;
    } else {
      conditionCount[data.main] = 1;
    }
  });

  const averageTemp = totalTemp / weatherData.length;
  const dominantCondition = Object.keys(conditionCount).reduce((a, b) => conditionCount[a] > conditionCount[b] ? a : b);

  return {
    averageTemp,
    maxTemp,
    minTemp,
    dominantCondition,
  };
};

const checkAlertConditions = (summary) => {
  return summary.maxTemp > 35;
};

module.exports = { convertKelvinToCelsius, getDailyWeatherSummary, checkAlertConditions };

