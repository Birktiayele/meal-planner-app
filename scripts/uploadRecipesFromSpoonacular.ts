// uploadRecipesFromSpoonacular.ts
// Fetches recipes from the Spoonacular API and uploads them to the Firestore 'kitchenRecipes' collection.
// Used to populate the app with curated recipes for user discovery.

import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const SPOONACULAR_API_KEY = 'your-api-key'; // Replace with your actual Spoonacular API key 
const fetchRecipes = async () => {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/random?number=10&apiKey=${SPOONACULAR_API_KEY}`
  );
  const data = await response.json();
  return data.recipes;
};

const uploadToFirestore = async () => {
  const recipes = await fetchRecipes();

  for (const recipe of recipes) {
    const ingredients = recipe.extendedIngredients.map((ing: any) => ing.original);
    const instructions = recipe.analyzedInstructions?.[0]?.steps.map((s: any) => s.step) || [];

    const docData = {
      title: recipe.title,
      image: recipe.image,
      course: 'Lunch', 
      cuisine: recipe.cuisines[0] || 'Global',
      ingredients,
      instructions,
      prepTime: `PT${recipe.readyInMinutes}M`,
      cookTime: 'PT0M',
      nutrition: {
        calories: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || '',
      },
      tags: recipe.dishTypes || [],
    };

    await addDoc(collection(db, 'kitchenRecipes'), docData);
    console.log(`✅ Uploaded: ${recipe.title}`);
  }

  console.log('🎉 All recipes uploaded!');
};

uploadToFirestore().catch(console.error);
