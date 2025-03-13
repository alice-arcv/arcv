// frontend/src/components/SneakerCard.js
import React from 'react';

const SneakerCard = ({ sneaker }) => {
  const imageUrl = sneaker.imageUrl || 
    (sneaker.marketData?.imageLinks && sneaker.marketData.imageLinks.length > 0 
      ? sneaker.marketData.imageLinks[0] 
      : 'https://via.placeholder.com/300?text=Sneaker');

  return (
    <div className="sneaker-card">
      <div className="sneaker-image">
        <img 
          src={imageUrl}
          alt={sneaker.name || 'Sneaker'} 
          className="sneaker-image-uniform"
          onError={(e) => {
            console.log('Image failed to load:', e.target.src);
            e.target.src = 'https://via.placeholder.com/300?text=Sneaker+Image';
          }}
        />
      </div>
      <div className="sneaker-info">
        <h3>{sneaker.name || 'Unknown Sneaker'}</h3>
        <div className="sneaker-brand">{sneaker.brand || 'Unknown Brand'}</div>
        {/* Add more details here */}
      </div>
    </div>
  );
};

export default SneakerCard;