import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/home';
import AboutPage from './pages/about';
import CoinDetails from './pages/coin-details';
import NotFound from './pages/NotFound';

const BASE_API_URL = 'https://api.coingecko.com/api/v3/coins/markets';

function App() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [cache, setCache] = useState({
    data: [],
    timestamp: null,
    expiresIn: 60000
  });

  const isCacheValid = () => {
    if (!cache.timestamp || !cache.data.length) return false;
    return Date.now() - cache.timestamp < cache.expiresIn;
  };
  const fetchCoinsFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = `${BASE_API_URL}?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
      const res = await fetch(apiUrl);
      
      if(!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      
      setCache({
        data: data,
        timestamp: Date.now(),
        expiresIn: 60000
      });
      
      setCoins(data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isCacheValid()) {
      setCoins(cache.data);
      setLoading(false);
    } else {
      fetchCoinsFromAPI();
    }
  }, []);
  const fallbackCoins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 50000, market_cap: 1000000000, total_volume: 200000000 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 3000, market_cap: 400000000, total_volume: 150000000 },
    { id: 'cardano', name: 'Cardano', symbol: 'ada', current_price: 0.5, market_cap: 20000000, total_volume: 10000000 }
  ];

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

  const processedCoins = React.useMemo(() => {
    const coinsToUse = coins.length > 0 ? coins : fallbackCoins;
    
    const filtered = coinsToUse.filter(coin => 
      coin.name.toLowerCase().includes(filter.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(filter.toLowerCase())
    );
    
    const sorted = sortCoins(filtered, sortBy);
    
    return sorted;
  }, [coins, filter, sortBy]);

  const paginationData = React.useMemo(() => {
    const totalPages = Math.ceil(processedCoins.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCoins = processedCoins.slice(startIndex, endIndex);
    
    return { totalPages, startIndex, endIndex, paginatedCoins };
  }, [processedCoins, currentPage, itemsPerPage]);
  
  const { totalPages, startIndex, endIndex, paginatedCoins } = paginationData;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [itemsPerPage, totalPages, currentPage]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage
                coins={coins}
                filter={filter}
                setFilter={setFilter}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                sortBy={sortBy}
                setSortBy={setSortBy}
                loading={loading}
                error={error}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                processedCoins={processedCoins}
                paginatedCoins={paginatedCoins}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                fetchCoinsFromAPI={fetchCoinsFromAPI}
                fallbackCoins={fallbackCoins}
                isCacheValid={isCacheValid}
                setCoins={setCoins}
                setLoading={setLoading}
                setError={setError}
              />
            } 
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/coin/:id" element={<CoinDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App