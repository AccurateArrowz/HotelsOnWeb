import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => (
  <div className="app-container">
    <Navbar />
    <main className="main-content">{children}</main>
    <footer className="app-footer">&copy; {new Date().getFullYear()} HotelBooker</footer>
  </div>
);

export default Layout; 