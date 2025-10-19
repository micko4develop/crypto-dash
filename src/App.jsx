import React from 'react';
import { useState, useEffect } from 'react';
import CoinCard from './components/CoinCard';
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

function App() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(100); // Uvećavam limit da učitam više podataka odjednom
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_desc');
  
  // Cache state
  const [cache, setCache] = useState({
    data: [],
    timestamp: null,
    expiresIn: 60000 // 1 minut u milisekundama
  });

  // Funkcija za provjeru da li je cache validan
  const isCacheValid = () => {
    if (!cache.timestamp || !cache.data.length) return false;
    return Date.now() - cache.timestamp < cache.expiresIn;
  };

  // Funkcija za učitavanje podataka sa API-ja
  const fetchCoinsFromAPI = async () => {
    try {
      setLoading(true);
      const apiUrl = `${BASE_API_URL}?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
      const res = await fetch(apiUrl);
      if(!res.ok) {
        throw new Error('Error to fetch data!');
      }
      const data = await res.json();
      console.log('Fetched from API:', data);
      
      // Sačuvaj u cache
      setCache({
        data: data,
        timestamp: Date.now(),
        expiresIn: 60000
      });
      
      setCoins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Učitaj podatke pri prvom renderovanju
  useEffect(() => {
    if (isCacheValid()) {
      console.log('Using cached data');
      setCoins(cache.data);
      setLoading(false);
    } else {
      console.log('Fetching fresh data from API');
      fetchCoinsFromAPI();
    }
  }, []); // Prazan dependency array - pokreće se samo jednom

  // Sort coins based on selected criteria
  const sortCoins = (coinsData, sortCriteria) => {
    const sortedCoins = [...coinsData];
    
    switch(sortCriteria) {
      case 'market_cap_desc':
        return sortedCoins.sort((a, b) => b.market_cap - a.market_cap);
      case 'market_cap_asc':
        return sortedCoins.sort((a, b) => a.market_cap - b.market_cap);
      case 'price_desc':
        return sortedCoins.sort((a, b) => b.current_price - a.current_price);
      case 'price_asc':
        return sortedCoins.sort((a, b) => a.current_price - b.current_price);
      case 'volume_desc':
        return sortedCoins.sort((a, b) => b.total_volume - a.total_volume);
      case 'volume_asc':
        return sortedCoins.sort((a, b) => a.total_volume - b.total_volume);
      default:
        return sortedCoins;
    }
  };

  const processedCoins = (() => {
    // Prvo filtriraj
    const filtered = coins.filter(coin => 
      coin.name.toLowerCase().includes(filter.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(filter.toLowerCase())
    );
    
    // Zatim sortiraj
    const sorted = sortCoins(filtered, sortBy);
    
    // Na kraju ograniči broj rezultata
    return sorted.slice(0, limit);
  })();

  return (
    <div>
      <h1>🚀 Crypto Dashboard</h1>
      
      {/* Cache Status */}
      <div className="cache-status">
        <span className={`cache-indicator ${isCacheValid() ? 'valid' : 'expired'}`}>
          {isCacheValid() ? '📦 Cached data' : '🔄 Cache expired'}
        </span>
        <button 
          className="refresh-btn" 
          onClick={fetchCoinsFromAPI}
          disabled={loading}
        >
          {loading ? 'Loading...' : '🔄 Refresh Data'}
        </button>
      </div>
      
      {/* Controls */}
      <div className="controls">
        <div className="filter">
          <input 
            type="text" 
            placeholder="Search coins..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        
        <div className="controls-row">
          <div className="control-group">
            <label htmlFor="limit">Show:</label>
            <select 
              id="limit" 
              value={limit} 
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          
          <div className="control-group">
            <label htmlFor="sort">Sort by:</label>
            <select 
              id="sort" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="market_cap_desc">Market Cap (High to Low)</option>
              <option value="market_cap_asc">Market Cap (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="volume_desc">Volume (High to Low)</option>
              <option value="volume_asc">Volume (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      { loading && <p>Loading...</p> }
      { error && <div className='error'>{ error }</div> }
      { !loading && !error && (
        <main className='grid'>
          {
            processedCoins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))
          }
        </main>
      )}
    </div>
  )
}

export default App