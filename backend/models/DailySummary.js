//backend\models\DailySummary.js
const mongoose = require('mongoose');
const DailySummarySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  city: { type: String, required: true },
  averageTemp: { type: Number, required: true },
  maxTemp: { type: Number, required: true },
  minTemp: { type: Number, required: true },
  dominantWeather: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('DailySummary', DailySummarySchema);

