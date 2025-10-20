import React from 'react';
import CoinCard from '../components/CoinCard';
import SearchInput from '../components/SearchInput';
import LimitSelector from '../components/LimitSelector';
import SortSelector from '../components/SortSelector';
import Pagination from '../components/Pagination';

function HomePage({ 
  filter, 
  setFilter, 
  itemsPerPage, 
  setItemsPerPage, 
  sortBy, 
  setSortBy, 
  loading, 
  error,
  currentPage,
  setCurrentPage,
  processedCoins,
  paginatedCoins,
  totalPages,
  fetchCoinsFromAPI,
  fallbackCoins,
  isCacheValid,
  setLoading
}) {
  return (
    <div>
      <h1>🚀 Crypto Dashboard</h1>
      
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
        <button 
          className="refresh-btn" 
          onClick={() => setCoins(fallbackCoins)}
          style={{marginLeft: '10px'}}
        >
          🧪 Use Test Data
        </button>
        <button 
          className="refresh-btn" 
          onClick={() => {
            setLoading(false);
            setError(null);
            setCoins(fallbackCoins);
          }}
          style={{marginLeft: '10px'}}
        >
          🔧 Force Display
        </button>
      </div>
      
      <div className="controls">
        <SearchInput 
          filter={filter} 
          onFilterChange={setFilter} 
        />
        
        <div className="controls-row">
          <LimitSelector 
            limit={itemsPerPage} 
            onLimitChange={setItemsPerPage} 
          />
          
          <SortSelector 
            sortBy={sortBy} 
            onSortChange={setSortBy} 
          />
        </div>
      </div>

      { loading && <p>Loading...</p> }
      { error && <div className='error'>{ error }</div> }
      { !loading && !error && (
        <main className='grid'>
          {
            paginatedCoins.length > 0 ? (
              paginatedCoins.map((coin) => (
                <CoinCard key={coin.id} coin={coin} />
              ))
            ) : (
              <p>No coins to display</p>
            )
          }
        </main>
      )}

      {!loading && !error && processedCoins.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={processedCoins.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}

export default HomePage;