import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
    <h1 style={{ color: '#c0392b', fontSize: '2.5rem', marginBottom: '1rem' }}>Unauthorized</h1>
    <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
      You do not have permission to access this page or perform this action.
    </p>
    <Link to="/" style={{ color: '#2980b9', textDecoration: 'underline', fontWeight: 500 }}>
      Go back to Home
    </Link>
  </div>
);

export default Unauthorized;
