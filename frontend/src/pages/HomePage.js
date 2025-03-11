import React from 'react';
import GoogleSneakerSearch from '../components/GoogleSneakerSearch';
import SneakerCard from '../components/SneakerCard';

function HomePage() {
  // This would normally come from your database
  const featuredSneakers = [
    {
      id: 'sample-1',
      name: 'Air Jordan 1',
      colorway: 'Dark Mocha',
      brand: 'Nike',
      image: 'https://via.placeholder.com/150',
      tags: ['jordans', 'brown', 'retro']
    },
    {
      id: 'sample-2',
      name: 'Yeezy Boost 350',
      colorway: 'Zebra',
      brand: 'Adidas',
      image: 'https://via.placeholder.com/150',
      tags: ['yeezy', 'zebra', 'boost']
    }
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to ArcV</h1>
        <p>Your visual database of sneakers</p>
        <div className="search-large">
          <GoogleSneakerSearch />
        </div>
      </div>

      <div className="featured-section">
        <h2>Featured Sneakers</h2>
        <div className="sneaker-grid">
          {featuredSneakers.map(sneaker => (
            <SneakerCard key={sneaker.id} sneaker={sneaker} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;