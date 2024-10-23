//frontend\src\components\SearchBar.js
import React, { useState } from 'react';
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(city);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
      <input
        type="text"
        placeholder="Search City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #007bff',
          borderRadius: '8px',
          marginRight: '10px',
          outline: 'none',
          width: '250px',
          transition: 'box-shadow 0.3s ease-in-out',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}
        onFocus={(e) => e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)'}
        onBlur={(e) => e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)'}
      />
      <button
        onClick={handleSearch}
        style={{
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease-in-out',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
