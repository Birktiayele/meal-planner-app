import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { fetchKitchenRecipes } from '../firebase/fetchKitchenRecipes';  
import { db } from '../firebase/firebaseConfig';

export default function TestKitchenRecipes() {
  useEffect(() => {
    const load = async () => {
      const recipes = await fetchKitchenRecipes();
      console.log('🔥 Fetched recipes:', recipes); 
    };

    load();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Check console for recipes</Text>
    </View>
  );
}
