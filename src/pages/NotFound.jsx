import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="about" style={{textAlign:'center'}}>
      <h1>404 - Not Found</h1>
      <p>We couldn't find the page you were looking for.</p>
      <Link to="/">⬅ Go back home</Link>
    </div>
  );
};

export default NotFound;
