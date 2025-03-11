import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

function FirebaseTest() {
  const [testMessage, setTestMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Test Firebase connection when component loads
  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Try to add a test document
        // eslint-disable-next-line no-unused-vars
        const docRef = await addDoc(collection(db, "test"), {
          message: "Firebase is connected!",
          timestamp: new Date()
        });
        
        // If successful, read from the database
        const querySnapshot = await getDocs(collection(db, "test"));
        let messages = [];
        querySnapshot.forEach((doc) => {
          messages.push(doc.data().message);
        });
        
        setTestMessage("Connected to Firebase! Found " + messages.length + " test messages.");
        setIsLoading(false);
      } catch (error) {
        setTestMessage("Error connecting to Firebase: " + error.message);
        setIsLoading(false);
      }
    };

    testFirebase();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#333', 
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h2>Firebase Connection Test</h2>
      {isLoading ? (
        <p>Testing connection to Firebase...</p>
      ) : (
        <p>{testMessage}</p>
      )}
    </div>
  );
}

export default FirebaseTest;