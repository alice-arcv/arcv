// frontend/src/components/DebugPanel.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

function DebugPanel() {
  const [sneakerCount, setSneakerCount] = useState(0);
  const [sampleSneakers, setSampleSneakers] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [apiStatus, setApiStatus] = useState('Unknown');

  useEffect(() => {
    async function fetchDebugData() {
      try {
        // Get count
        const sneakersRef = collection(db, "sneakers");
        const snapshot = await getDocs(sneakersRef);
        setSneakerCount(snapshot.size);
        
        // Get sample sneakers
        const q = query(sneakersRef, limit(3));
        const sampleSnapshot = await getDocs(q);
        const samples = [];
        sampleSnapshot.forEach(doc => {
          samples.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setSampleSneakers(samples);
        
        // Check API status
        try {
          const response = await fetch('/api/sneakers/search?query=test&limit=1');
          if (response.ok) {
            setApiStatus('Connected');
          } else {
            setApiStatus(`Error: ${response.status}`);
          }
        } catch (error) {
          setApiStatus(`Error: ${error.message}`);
        }
      } catch (error) {
        console.error("Error fetching debug data:", error);
      }
    }
    
    fetchDebugData();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: '#333',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 1000,
      maxWidth: expanded ? '400px' : '200px',
      maxHeight: expanded ? '400px' : 'auto',
      overflow: 'auto'
    }}>
      <button 
        onClick={() => setExpanded(!expanded)}
        style={{
          backgroundColor: '#47956f',
          border: 'none',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        {expanded ? 'Collapse' : 'Expand'} Debug Panel
      </button>
      
      <div><strong>Firebase Sneakers:</strong> {sneakerCount}</div>
      <div><strong>SneakersAPI Status:</strong> {apiStatus}</div>
      
      {expanded && sampleSneakers.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <strong>Sample Sneakers (3):</strong>
          {sampleSneakers.map((sneaker, index) => (
            <div key={index} style={{ 
              marginTop: '10px', 
              padding: '5px', 
              backgroundColor: '#444' 
            }}>
              <div><strong>ID:</strong> {sneaker.id.substring(0, 8)}...</div>
              <div><strong>Name:</strong> {sneaker.name}</div>
              <div><strong>Brand:</strong> {sneaker.brand}</div>
              <div><strong>Source:</strong> {sneaker.source || 'unknown'}</div>
              <div><strong>Tags:</strong> {(sneaker.tags || []).join(', ')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DebugPanel;