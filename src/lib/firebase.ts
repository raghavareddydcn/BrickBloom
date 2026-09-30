import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: 'brickbloom-invoices.firebaseapp.com',
  projectId: 'brickbloom-invoices',
  storageBucket: 'brickbloom-invoices.firebasestorage.app',
  messagingSenderId: '988743230343',
  appId: '1:988743230343:web:b2d850dd30c668e92ee922',
};

export const firestore = getFirestore(initializeApp(firebaseConfig));
