import React from 'react';

function AboutPage() {
  return (
    <div className="about">
      <h1>About Crypto Dashboard</h1>
      <p>
        Welcome to the Crypto Dashboard! This application provides real-time cryptocurrency 
        market data and allows you to track the performance of various digital currencies.
      </p>
      <p>
        Features include:
      </p>
      <ul>
        <li>Real-time cryptocurrency prices</li>
        <li>Market cap and volume data</li>
        <li>Search and filter functionality</li>
        <li>Sorting by various criteria</li>
        <li>Pagination for easy navigation</li>
        <li>Responsive design</li>
      </ul>
      <p>
        Data is provided by CoinGecko API and is updated regularly to ensure accuracy.
      </p>
    </div>
  );
}

export default AboutPage;
