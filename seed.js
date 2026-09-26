const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyCE9R7HACDhgVG-WH7KANSRzyEfhXHg8BQ',
  authDomain: 'brickbloom-invoices.firebaseapp.com',
  projectId: 'brickbloom-invoices',
  storageBucket: 'brickbloom-invoices.firebasestorage.app',
  messagingSenderId: '988743230343',
  appId: '1:988743230343:web:b2d850dd30c668e92ee922'
};

const DEFAULT_PRODUCT_CATALOG = [
  { name: '2 Inch Pot',                price1: 25, price50: 22, price100: 20 },
  { name: '3 inch Pot',                price1: 40, price50: 30, price100: 25 },
  { name: '4 inch Pot',                price1: 50, price50: 35, price100: 30 },
  { name: '6 inch Pot (Std)',          price1: 60, price50: 50, price100: 45 },
  { name: '6 inch Pot (Heavy)',        price1: 70, price50: 60, price100: 55 },
  { name: '8 Inch Pot',                price1: 80, price50: 60, price100: 50 },
  { name: 'Hangeer for 8 inch',        price1: 150, price50: 140, price100: 120 },
  { name: '50 mm Disc',                price1: 15, price50: 12, price100: 10 },
  { name: '100 mm Disc',               price1: 0,  price50: 0,  price100: 0 },
  { name: '650 Gm Bric',               price1: 99, price50: 89, price100: 79 },
  { name: '5Kg Block',                 price1: 300, price50: 269, price100: 249 },
  { name: 'Pole 1 Feet',               price1: 0,  price50: 0,  price100: 0 },
  { name: 'Ready Pot',                 price1: 149, price50: 135, price100: 129 },
  { name: 'Starter Kit',               price1: 159, price50: 145, price100: 139 },
  { name: 'Medium Kit',                price1: 249, price50: 235, price100: 229 },
  { name: 'Premium Kit',               price1: 699, price50: 659, price100: 649 },
  { name: 'Ready pot With Out Plant', price1: 130, price50: 119, price100: 99 }
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log('Starting seed...');
  for (const p of DEFAULT_PRODUCT_CATALOG) {
    console.log('Adding:', p.name);
    await setDoc(doc(db, 'products', p.name), p);
  }
  console.log('Seed complete!');
  process.exit(0);
}
seed().catch(console.error);
