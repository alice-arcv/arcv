import React from 'react';
import { Link } from 'react-router-dom';

function SneakerCard({ sneaker }) {
  // If no sneaker is provided, use default data
  const sneakerData = sneaker || {
    id: 'sample-1',
    name: 'Air Jordan 1',
    colorway: 'Dark Mocha',
    brand: 'Nike',
    image: 'https://via.placeholder.com/150',
    tags: ['jordans', 'brown', 'retro']
  };

  return (
    <div className="sneaker-card">
      <Link to={`/sneaker/${sneakerData.id}`}>
        <div className="sneaker-image">
          <img src={sneakerData.image} alt={sneakerData.name} />
        </div>
        <div className="sneaker-info">
          <h3>{sneakerData.brand} {sneakerData.name}</h3>
          <p>{sneakerData.colorway}</p>
          <div className="sneaker-tags">
            {sneakerData.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default SneakerCard;