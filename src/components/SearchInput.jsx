import React from 'react';

const SearchInput = ({ filter, onFilterChange }) => {
  return (
    <div className="filter">
      <input 
        type="text" 
        placeholder="Search coins..." 
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;