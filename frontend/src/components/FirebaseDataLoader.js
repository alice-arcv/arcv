// frontend/src/components/FirebaseDataLoader.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

// Sample data to load
const sampleSneakers = [
  {
    name: 'AIR JORDAN 1',
    colorway: 'Retro High OG/Palomino',
    brand: 'Jordan',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-7d3afe1e-a9bf-498a-a398-1068d803b417/air-jordan-1-mocha-shoes.png',
    releaseYear: 2022,
    material: ['leather', 'rubber'],
    gender: 'Men',
    age: 'Adult',
    price: 180,
    tags: ['jordan', 'air jordan', 'mocha', 'brown', 'high top']
  },
  {
    name: 'AIR JORDAN 1',
    colorway: 'Retro High OG/Palomino',
    brand: 'Jordan',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e125b578-4173-401a-ab13-f066979c8848/air-jordan-1-high-og-shoes-Pz5fxP.png',
    releaseYear: 2021,
    material: ['leather', 'synthetic'],
    gender: 'Men',
    age: 'Adult',
    price: 170,
    tags: ['jordan', 'air jordan', 'palomino', 'high top']
  },
  {
    name: 'AIR JORDAN 1',
    colorway: 'Low/White',
    brand: 'Jordan',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/f94d83a8-3844-4e10-8d32-d6b92345e321/air-jordan-1-low-shoes-459b4T.png',
    releaseYear: 2020,
    material: ['leather', 'textile'],
    gender: 'Women',
    age: 'Adult',
    price: 130,
    tags: ['jordan', 'air jordan', 'low', 'white']
  },
  {
    name: 'NIKE DUNK LOW',
    colorway: 'White/Black',
    brand: 'Nike',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5f7d8481-7a77-41b7-8c09-d1a7e354c5c5/dunk-low-shoes-7jJdLk.png',
    releaseYear: 2022,
    material: ['leather', 'rubber'],
    gender: 'Unisex',
    age: 'Adult',
    price: 110,
    tags: ['nike', 'dunk', 'low', 'panda', 'black', 'white']
  },
  {
    name: 'NIKE DUNK HIGH',
    colorway: 'Retro/Red',
    brand: 'Nike',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5a9cf2c0-4622-4530-9d74-c33b5e3238d9/dunk-high-retro-shoes-TXl9tR.png',
    releaseYear: 2021,
    material: ['leather', 'textile'],
    gender: 'Men',
    age: 'Adult',
    price: 125,
    tags: ['nike', 'dunk', 'high', 'red', 'retro']
  },
  {
    name: 'ADIDAS ULTRABOOST 21',
    colorway: 'Core Black/Grey',
    brand: 'Adidas',
    imageUrl: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c2ed913b62524f6a9c55ac7100d3ec28_9366/Ultraboost_21_Shoes_Black_FY0378_01_standard.jpg',
    releaseYear: 2021,
    material: ['textile', 'synthetic'],
    gender: 'Unisex',
    age: 'Adult',
    price: 180,
    tags: ['adidas', 'ultraboost', 'boost', 'black', 'grey', 'running']
  }
];

function FirebaseDataLoader() {
  const [status, setStatus] = useState('');
  const [dataCount, setDataCount] = useState(0);
  
  // Check how many sneakers are in the database
  const checkDataCount = async () => {
    try {
      const q = query(collection(db, "sneakers"), limit(100));
      const querySnapshot = await getDocs(q);
      setDataCount(querySnapshot.size);
    } catch (error) {
      console.error("Error checking data count:", error);
      setStatus(`Error checking data: ${error.message}`);
    }
  };
  
  // Load initial data on component mount
  React.useEffect(() => {
    checkDataCount();
  }, []);
  
  // Add sample data to Firebase
  const loadSampleData = async () => {
    setStatus('Loading sample data...');
    
    try {
      // Add each sample sneaker to the Firestore collection
      for (const sneaker of sampleSneakers) {
        await addDoc(collection(db, "sneakers"), {
          ...sneaker,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      setStatus(`Successfully loaded ${sampleSneakers.length} sample sneakers!`);
      checkDataCount(); // Update the count
    } catch (error) {
      console.error("Error loading sample data:", error);
      setStatus(`Error loading data: ${error.message}`);
    }
  };
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#333',
      borderRadius: '8px',
      marginTop: '20px',
      color: 'white'
    }}>
      <h2>Firebase Data Loader</h2>
      <p>This component helps you load sample data into Firebase for testing.</p>
      
      <div style={{ marginBottom: '15px' }}>
        <p>Current sneaker count in database: <strong>{dataCount}</strong></p>
      </div>
      
      <button 
        onClick={loadSampleData}
        style={{
          padding: '8px 16px',
          backgroundColor: '#47956f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Load Sample Sneakers
      </button>
      
      {status && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#444', borderRadius: '4px' }}>
          {status}
        </div>
      )}
    </div>
  );
}

export default FirebaseDataLoader;