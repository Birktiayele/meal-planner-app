// firebaseConfig.ts
// Initializes and exports the Firebase app and Firestore database instance.
// Used across the app to interact with Firebase services.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAqRvJ4KtlBth166cPAmWk0uCHwztllM3k",
  authDomain: "mealplannerapp-32cac.firebaseapp.com",
  projectId: "mealplannerapp-32cac",
  storageBucket: "mealplannerapp-32cac.firebasestorage.app",
  messagingSenderId: "261748729246",
  appId: "1:261748729246:web:1b4c87bdfd8deb4d56e28f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

