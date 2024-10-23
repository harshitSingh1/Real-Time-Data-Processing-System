// frontend/src/components/Alerts.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/alerts');
      console.log('Fetched alerts:', response.data); // Debugging line
      if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
        setAlerts(response.data);
      } else {
        setError('6 alerts received from API');
      }
    } catch (error) {
      setError('Error fetching alerts');
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000); // 5-second fallback
    fetchAlerts();
    return () => clearTimeout(timer);
  }, []);
  
  

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Alerts
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : alerts.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No alerts to display.
          </Typography>
        ) : (
          <List>
            {alerts.map((alert, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`City: ${alert.city}`}
                  secondary={`Temperature: ${alert.temp}°C, Condition: ${alert.main}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );  
};

export default Alerts;
