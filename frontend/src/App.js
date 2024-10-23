import React, { useState } from 'react';
import WeatherSummary from './components/WeatherSummary';
import SearchBar from './components/SearchBar';
import { Container, Typography } from '@mui/material';
import './App.css';

const App = () => {
  const [searchCity, setSearchCity] = useState('');

  const handleSearch = (city) => {
    setSearchCity(city);
  };

  return (
    <Container
      maxWidth="lg"
      style={{
        backgroundColor: '#e3f2fd',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        marginTop: '40px',
        textAlign: 'center',
        transition: 'transform 0.3s ease-in-out',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <Typography
        variant="h3"
        component="h3"
        gutterBottom
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: '#0d47a1',
          fontWeight: 'bold',
          animation: 'fadeIn 2s',
        }}
      >
        Weather Monitoring Dashboard
      </Typography>
      <SearchBar onSearch={handleSearch} />
      <WeatherSummary searchCity={searchCity} />
    </Container>
  );
};

export default App;
