import React from 'react';

const LimitSelector = ({ limit, onLimitChange }) => {
  return (
    <div className="control-group">
      <label htmlFor="limit">Show:</label>
      <select 
        id="limit" 
        value={limit} 
        onChange={(e) => onLimitChange(Number(e.target.value))}
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
};

export default LimitSelector;