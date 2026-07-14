import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAP1hnp_B3qmJgRDeCxblOWyJgsNMxt4Y8',
  authDomain: 'sdm-performance-evaluation.firebaseapp.com',
  databaseURL: 'https://sdm-performance-evaluation-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'sdm-performance-evaluation',
  storageBucket: 'sdm-performance-evaluation.firebasestorage.app',
  messagingSenderId: '754071748546',
  appId: '1:754071748546:web:5c7465caec92c84b46205b',
  measurementId: 'G-QTVDDVZHVJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get database reference
export const database: Database = getDatabase(app);

export default app;
