// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA5GUFgKuA01utDq1PEkH3CrYQ83J_cc98",

  authDomain: "test-3f441.firebaseapp.com",

  projectId: "test-3f441",

  storageBucket: "test-3f441.appspot.com",

  messagingSenderId: "470571778154",

  appId: "1:470571778154:web:ffe6dc9eed108c079f0a13",

  measurementId: "G-M80FRR5JPK"

};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
