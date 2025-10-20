import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CoinCard = ({ coin }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link to={`/coin/${coin.id}`} className='coin-card' key={coin.id} style={{display:'block'}}>
      <div className='coin-header'>
        {imageError ? (
          <div className='coin-image-placeholder'>
            <span className='placeholder-text'>{coin.symbol.toUpperCase()}</span>
          </div>
        ) : (
          <img 
            src={coin.image} 
            alt={coin.name} 
            className='coin-image' 
            onError={handleImageError}
          />
        )}
        <div>
          <h3>{coin.name}</h3>
          <span className='symbol'>{coin.symbol.toUpperCase()}</span>
        </div>
      </div>
      <div className='coin-price'>
        <span className='price'>
          ${coin.current_price ? coin.current_price.toLocaleString() : 'N/A'}
        </span>
        <span className={`price-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
          {coin.price_change_percentage_24h !== null && coin.price_change_percentage_24h !== undefined 
            ? `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%`
            : 'N/A'
          }
        </span>
      </div>
      <div className='coin-stats'>
        <div className='stat'>
          <span className='stat-label'>Market Cap</span>
          <span className='stat-value'>
            ${coin.market_cap ? coin.market_cap.toLocaleString() : 'N/A'}
          </span>
        </div>
        <div className='stat'>
          <span className='stat-label'>Volume 24h</span>
          <span className='stat-value'>
            ${coin.total_volume ? coin.total_volume.toLocaleString() : 'N/A'}
          </span>
        </div>
        <div className='stat'>
          <span className='stat-label'>Rank</span>
          <span className='stat-value'>
            #{coin.market_cap_rank || 'N/A'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CoinCard;
