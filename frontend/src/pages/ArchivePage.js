import React from 'react';

function ArchivePage() {
  // This would be loaded from Firebase in a real app
  const collections = [
    {
      id: 'coll-1',
      name: 'Jordans',
      imageUrl: 'https://via.placeholder.com/150',
      tags: ['red', 'jordans', 'nike', 'sneakers']
    },
    {
      id: 'coll-2',
      name: 'Running Shoes',
      imageUrl: 'https://via.placeholder.com/150',
      tags: ['running', 'sneakers']
    }
  ];

  return (
    <div className="archive-page">
      <h1>My Archive</h1>
      
      <div className="collections-grid">
        {collections.map(collection => (
          <div key={collection.id} className="collection-card">
            <div className="collection-image">
              <img src={collection.imageUrl} alt={collection.name} />
            </div>
            <div className="collection-info">
              <h3>{collection.name}</h3>
              <div className="collection-tags">
                {collection.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {/* Add new collection button */}
        <div className="collection-card add-new">
          <div className="add-button">
            <span className="plus">+</span>
            <p>Add New Collection</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArchivePage;