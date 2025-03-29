import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          ArcV
        </Link>
      </div>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search sneakers..." 
          className="search-input"
        />
      </div>
      <div className="nav-links">
        <Link to="/archive" className="nav-link">My Archive</Link>
        <Link to="/messages" className="nav-link">Messages</Link>
        <div className="user-icon">
          <Link to="/profile">
            {/* User icon will go here */}
            👤
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;