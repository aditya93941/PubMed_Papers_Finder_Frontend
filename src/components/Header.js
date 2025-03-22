import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <div className="container header-actions">
        <div>
          <h1 className="app-title">PubMed Papers Finder</h1>
          <p className="header-description">Find research papers with authors from pharmaceutical and biotech companies</p>
        </div>
        <nav>
          <Link to="/" className="btn">Home</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header; 