import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB9XX1pq9LfhhRb6OdlTP2FBfCRzIecvQk',
  authDomain: 'todo-app-28aa7.firebaseapp.com',
  projectId: 'todo-app-28aa7',
  storageBucket: 'todo-app-28aa7.appspot.com',
  messagingSenderId: '630389864804',
  appId: '1:630389864804:web:a504ef057cac0c3db0e271',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
