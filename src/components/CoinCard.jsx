import React from 'react';

const CoinCard = ({ coin }) => {
  return (
    <div className='coin-card' key={coin.id}>
      <div className='coin-header'>
        <img src={coin.image} alt={coin.name} className='coin-image' />
        <div>
          <h3>{coin.name}</h3>
          <span className='symbol'>{coin.symbol.toUpperCase()}</span>
        </div>
      </div>
      <div className='coin-price'>
        <span className='price'>${coin.current_price.toLocaleString()}</span>
        <span className={`price-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
          {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
        </span>
      </div>
      <div className='coin-stats'>
        <div className='stat'>
          <span className='stat-label'>Market Cap</span>
          <span className='stat-value'>${coin.market_cap.toLocaleString()}</span>
        </div>
        <div className='stat'>
          <span className='stat-label'>Volume 24h</span>
          <span className='stat-value'>${coin.total_volume.toLocaleString()}</span>
        </div>
        <div className='stat'>
          <span className='stat-label'>Rank</span>
          <span className='stat-value'>#{coin.market_cap_rank}</span>
        </div>
      </div>
    </div>
  );
};

export default CoinCard;
