// RecipeSearchScreen.tsx
// Displays a WebView for browsing recipes online and allows users to import them into the app.
// Scrapes recipe data (title, ingredients, instructions, etc.) and passes it to the WriteMealModal for editing and saving.
import React, { useRef, useState } from 'react';
import {
  View,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import WriteMealModal from '../components/WriteMealModal';

const RecipeSearchScreen = () => {
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const [foodImageUri, setFoodImageUri] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [mealName, setMealName] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [course, setCourse] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [nutrition, setNutrition] = useState<{
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
} | null>(null);


  const handleImport = async () => {
    if (!currentUrl) {
      Alert.alert('No recipe URL', 'Please open a recipe page first.');
      return;
    }

    const cleanUrl = currentUrl.split('?')[0];

    try {
      const response = await fetch(
        'https://recipe-scraper-9zge.onrender.com/scrape-recipe',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: cleanUrl }),
        }
      );

      const recipe = await response.json();
      console.log('🍲 Scraped recipe:', recipe);

      if (!recipe?.title) {
        Alert.alert('Failed to import', 'No valid recipe found on this page.');
        return;
      }

      setMealName(recipe.title);
      setIngredients(recipe.ingredients || []);
      setInstructions(recipe.instructions || []);
      setPrepTime(recipe.prepTime || '');
      setCookTime(recipe.cookTime || '');
      setCourse(recipe.course || '');
      setCuisine(recipe.cuisine || '');
      setShowWriteModal(true);
      setNutrition(recipe.nutrition || null);

    } catch (err) {
      Alert.alert('Error', 'Could not fetch recipe. Please try again.');
      console.error('Import failed:', err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{
          uri: 'https://www.allrecipes.com/recipe/24074/alysias-basic-meat-lasagna/',
        }}
        onNavigationStateChange={(navState) => setCurrentUrl(navState.url)}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator style={{ marginTop: 20 }} />}
        useWebKit={false}
      />

      <View style={[styles.importButton, { paddingHorizontal: width * 0.05 }]}>
        <Button
          title="Import This Recipe"
          onPress={handleImport}
          color="#00C851"
        />
      </View>

      <WriteMealModal
  visible={showWriteModal}
  onClose={() => setShowWriteModal(false)}
  mealType="Imported"
  mealName={mealName}
  onChangeMealName={setMealName}
  onSave={() => {
    setShowWriteModal(false);
    Alert.alert('Saved!', `${mealName} added to meal plan`);
  }}
  imageUri={foodImageUri} 
  onImageSelect={setFoodImageUri} 
  ingredients={ingredients}
  instructions={instructions}
  prepTime={prepTime}
  cookTime={cookTime}
  course={course}
  cuisine={cuisine}
  nutrition={nutrition}
/>


    </View>
  );
};

const styles = StyleSheet.create({
  importButton: {
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});

export default RecipeSearchScreen;
