// fetchKitchenRecipes.ts
// Fetches curated recipe data from the 'kitchenRecipes' collection in Firestore.
// Returns an array of recipe objects with document IDs included.

import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const fetchKitchenRecipes = async () => {
  const recipesRef = collection(db, 'kitchenRecipes');
  const snapshot = await getDocs(recipesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
