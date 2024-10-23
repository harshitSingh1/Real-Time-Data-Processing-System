// backend/alerts.js
require('dotenv').config();
const nodemailer = require('nodemailer');
const { getDailyWeatherSummary, checkAlertConditions } = require('./utils');

const ALERT_THRESHOLD_TEMP = parseFloat(process.env.ALERT_THRESHOLD_TEMP || "35");
const ALERT_CONSECUTIVE_UPDATES = parseInt(process.env.ALERT_CONSECUTIVE_UPDATES || "2");

let lastWeatherData = [];
let alertConsecutiveCount = 0;

// Use environment variables for credentials
const EMAIL_USER = process.env.EMAIL_USER || "";
const EMAIL_PASS = process.env.EMAIL_PASS || "";

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error("Email credentials are not set in the environment variables.");
  process.exit(1);
}

let alertList = [];

const checkAlerts = (weatherData) => {
  const dailySummary = getDailyWeatherSummary(weatherData);
  console.log('Daily Summary:', dailySummary); // Debugging line
  if (checkAlertConditions(dailySummary)) {
    alertConsecutiveCount += 1;
    console.log('Alert condition met. Consecutive count:', alertConsecutiveCount); // Debugging line
    if (alertConsecutiveCount >= ALERT_CONSECUTIVE_UPDATES) {
      sendAlert(dailySummary);
      alertList.push({
        city: dailySummary.city,
        temp: dailySummary.averageTemp,
        main: dailySummary.dominantWeather,
        date: dailySummary.date,
        time: dailySummary.time
      });
      console.log('Alert added to alertList:', alertList); // Debugging line
      alertConsecutiveCount = 0;
    }
  } else {
    alertConsecutiveCount = 0;
  }
};



app.get('/api/alerts', (req, res) => {
  res.json(alertList);
});



const sendAlert = (summary) => {
  // Email setup
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: EMAIL_USER,
    subject: 'Weather Alert',
    text: `Alert! The following weather conditions have been met:\n\n${JSON.stringify(summary, null, 2)}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending alert:', error);
    } else {
      console.log('Alert sent:', info.response);
    }
  });
};

module.exports = { checkAlerts };
