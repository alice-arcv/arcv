// frontend/src/components/ApiTester.jsx
import React, { useState } from 'react';

function ApiTester() {
  const [testTerm, setTestTerm] = useState('jordan 1');
  const [apiResults, setApiResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiType, setApiType] = useState('zyla'); // Default to Zyla API

  const testDirectApiCall = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Testing direct API call to ${apiType === 'zyla' ? 'Zyla API' : 'SneakersAPI'}...`);
      
      // Use the selected API
      const endpoint = apiType === 'zyla' 
        ? `/api/zyla/search?query=${encodeURIComponent(testTerm)}`
        : `/api/sneakers/search?query=${encodeURIComponent(testTerm)}`;
      
      const response = await fetch(endpoint);
      
      // Log the raw response for debugging
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`${apiType === 'zyla' ? 'Zyla API' : 'SneakersAPI'} Test Results:`, data);
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
        <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
          <label>
            <input 
              type="radio" 
              name="apiType" 
              value="zyla" 
              checked={apiType === 'zyla'} 
              onChange={() => setApiType('zyla')}
            /> Zyla API
          </label>
          <label>
            <input 
              type="radio" 
              name="apiType" 
              value="sneakers" 
              checked={apiType === 'sneakers'} 
              onChange={() => setApiType('sneakers')}
            /> SneakersAPI
          </label>
        </div>
        <button 
          onClick={testDirectApiCall}
          style={{ padding: '5px 10px', background: '#47956f', color: 'white', border: 'none' }}
        >
          Test {apiType === 'zyla' ? 'Zyla API' : 'SneakersAPI'}
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
          <div><strong>Status:</strong> {apiResults.success !== false ? 'Success' : 'Failed'}</div>
          <div><strong>Results:</strong> {
            apiType === 'zyla' 
              ? apiResults.results?.length || 0 
              : apiResults.results?.length || 0
          }</div>
          {apiResults.results && apiResults.results.length > 0 && (
            <div>
              <strong>First result:</strong>
              <div>{apiResults.results[0].name}</div>
              {(apiResults.results[0].imageUrl || 
                apiResults.results[0].image?.original || 
                apiResults.results[0].image?.small) && (
                <img 
                  src={apiResults.results[0].imageUrl || 
                       apiResults.results[0].image?.original || 
                       apiResults.results[0].image?.small}
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