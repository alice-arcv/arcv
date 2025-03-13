// frontend/src/components/ApiTester.jsx
import React, { useState } from 'react';

function ApiTester() {
  const [testTerm, setTestTerm] = useState('jordan 1');
  const [apiResults, setApiResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testDirectApiCall = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing direct API call to SneakersAPI...');
      const response = await fetch(`/api/sneakers/search?query=${encodeURIComponent(testTerm)}`);
      
      // Log the raw response for debugging
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log('SneakersAPI Test Results:', data);
      setApiResults(data);
    } catch (err) {
      console.error('API Test Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      zIndex: 1000,
      background: '#333',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      maxWidth: '300px'
    }}>
      <h3>API Tester</h3>
      <div style={{ marginBottom: '10px' }}>
        <input 
          type="text" 
          value={testTerm} 
          onChange={(e) => setTestTerm(e.target.value)}
          style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
        />
        <button 
          onClick={testDirectApiCall}
          style={{ padding: '5px 10px', background: '#47956f', color: 'white', border: 'none' }}
        >
          Test SneakersAPI
        </button>
      </div>
      
      {loading && <div>Testing API...</div>}
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}
      
      {apiResults && (
        <div style={{ marginTop: '10px', fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
          <div><strong>Status:</strong> {apiResults.success ? 'Success' : 'Failed'}</div>
          <div><strong>Results:</strong> {apiResults.results?.length || 0}</div>
          {apiResults.results && apiResults.results.length > 0 && (
            <div>
              <strong>First result:</strong>
              <div>{apiResults.results[0].name}</div>
              {apiResults.results[0].imageUrl && (
                <img 
                  src={apiResults.results[0].imageUrl} 
                  alt="Thumbnail" 
                  style={{ width: '100px', height: 'auto', marginTop: '5px' }}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ApiTester;