// MealPlanScreen.tsx
// Main screen for viewing and managing the user's meal plan.
// Displays meals organized by date, with options to add, edit, or view details.

import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import WriteMealModal from '../components/WriteMealModal';
import AddMealModal from '../components/AddMealModal';
import PasteModal from '../components/PasteModal'; 
import KitchenRecipesModal from '../components/KitchenRecipesModal'; 
import PreviewRecipeModal from '../components/PreviewRecipeModal'; 
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function MealPlanScreen() {
  const [selectedDate, setSelectedDate] = useState('8');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [showSnapOptions, setShowSnapOptions] = useState(false);
  const [newMealName, setNewMealName] = useState('');
  const [addTargetType, setAddTargetType] = useState('');
  const [addMealModalVisible, setAddMealModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [showKitchenModal, setShowKitchenModal] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [foodImageUri, setFoodImageUri] = useState('');
  const [course, setCourse] = useState('');
const [cuisine, setCuisine] = useState('');
const [prepTime, setPrepTime] = useState('');
const [cookTime, setCookTime] = useState('');
const [nutrition, setNutrition] = useState(null);

  const [showPasteModal, setShowPasteModal] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [writeModalSource, setWriteModalSource] = useState<'snap' | 'write' | 'paste' | 'search' | 'kitchen' | null>(null);
  const defaultMealTypes = ['Break Fast', 'Lunch', 'Dinner', 'Snack'];
  const [mealsByDate, setMealsByDate] = useState({
    '8': {
      'Break Fast': ['Oatmeal', 'Fruit Smoothie'],
      'Lunch': ['Chicken Wrap'],
      'Dinner': ['Spaghetti'],
      'Snack': ['Granola Bar'],
    },
    '2025-04-16': {
      'Break Fast': ['Pancakes'],
      'Lunch': ['Turkey Sandwich'],
      'Dinner': ['Grilled Fish'],
      'Snack': ['Apple'],
    },
  });

  const meals = mealsByDate[selectedDate] || {};
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleAddMeal = (mealType: string) => {
    setAddTargetType(mealType);
    setAddMealModalVisible(true);
  };

  const handleSaveMeal = () => {
    if (!newMealName.trim()) return;
    setMealsByDate(prev => {
      const existingMeals = prev[selectedDate]?.[addTargetType] || [];
      return {
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          [addTargetType]: [...existingMeals, newMealName.trim()],
        },
      };
    });
    setNewMealName('');
    setShowWriteModal(false);
  };

  const handleSnapAndScanMeal = async () => {
    setShowSnapOptions(true);
  };

  const launchCameraOrGallery = async (source: 'camera' | 'library') => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    alert('Camera permission is required');
    return;
  }

  const result = source === 'camera'
    ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.7 })
    : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.7 });

  if (result.canceled || !result.assets?.[0]?.uri) {
    alert('Image selection canceled or failed.');
    return;
  }

  const imageUri = result.assets[0].uri;
  setImageUri(imageUri);     
  setShowSnapOptions(false);  

  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    formData.append('language', 'eng');
    formData.append('apikey', 'K87615154788957'); // 🔑 Your OCR.Space API key

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    });

    const data = await response.json();
    const parsedText = data?.ParsedResults?.[0]?.ParsedText || '';

    if (!parsedText) {
      alert('❌ No text found in image.');
      return;
    }

    const { mealTitle, ingredientsList, instructionsList } = processScannedRecipe(parsedText);

    setNewMealName(mealTitle);
    setIngredients(ingredientsList);
    setInstructions(instructionsList);
    setShowWriteModal(true); 
  } catch (error) {
    console.error('OCR error:', error);
    alert('An error occurred while scanning the image.');
  }
};

const processScannedRecipe = (text: string) => {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const mealTitle = lines[0] || 'Untitled Recipe';

  const ingredientsList = lines.filter((line) =>
    line.toLowerCase().includes('cup') ||
    line.toLowerCase().includes('tsp') ||
    line.toLowerCase().includes('tbsp') ||
    line.toLowerCase().includes('gram') ||
    line.match(/^\d/)
  );

  const instructionsList = lines.filter((line) =>
    line.match(/^\d+\./) || line.toLowerCase().includes('step')
  );

  return { mealTitle, ingredientsList, instructionsList };
};


  const handleSearchRecipe = () => {
    setAddMealModalVisible(false);
    router.push('/screens/RecipeSearchScreen');
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#E9FCD7' }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)} style={styles.calendarIcon}>
          <Ionicons name="calendar-outline" size={24} color="#444" />
        </TouchableOpacity>

<TouchableOpacity onPress={() => router.push('/test-kitchen-recipes')}>
  <Text style={{ color: 'blue' }}>Go to Test Kitchen Recipes</Text>
</TouchableOpacity>


        {showCalendar ? (
          <Calendar
            onDayPress={(day: { dateString: string }) => {
              setSelectedDate(day.dateString);
              setShowCalendar(false);
            }}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#56E055' },
            }}
          />
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.todayLabel}>Meals for {selectedDate}</Text>
              {defaultMealTypes.map((type) => (
                <View key={type} style={styles.mealSection}>
                  <Text style={styles.mealTitle}>{type}</Text>
                  {(meals[type] || []).map((meal, index) => (
                    <View key={index} style={styles.mealBox}>
                      <Text style={styles.mealText}>{meal}</Text>
                      <View style={styles.icons}>
                        <Ionicons name="create-outline" size={20} color="#FFD700" style={styles.icon} />
                        <Ionicons name="trash-outline" size={20} color="#FFD700" />
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity onPress={() => handleAddMeal(type)}>
                    <Text style={styles.addMealText}>+ Add Meal</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setAddMealModalVisible(true)}
            >
              <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
          </>
        )}

        <AddMealModal
  visible={addMealModalVisible}
  onClose={() => setAddMealModalVisible(false)}
  onSelectWrite={() => {
    setAddMealModalVisible(false);
    setNewMealName('');
    setIngredients([]);
    setInstructions([]);
    setImageUri('');
    setWriteModalSource('write');         
    setShowWriteModal(true);
  }}
  onSelectSnap={() => {
    setWriteModalSource('snap');        
    setShowSnapOptions(true);           
  }}
  onSelectSearch={handleSearchRecipe}
  onSelectPaste={() => {
    setWriteModalSource('paste');        
    setShowPasteModal(true);             
  }}
  onSelectKitchen={() => {
    setAddMealModalVisible(false);
    setWriteModalSource('kitchen');
    setShowKitchenModal(true);     
  }}
/>


        <Modal visible={showSnapOptions} transparent animationType="slide">
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
              <TouchableOpacity onPress={() => launchCameraOrGallery('camera')} style={styles.optionButton}>
                <Text style={styles.optionText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => launchCameraOrGallery('library')} style={styles.optionButton}>
                <Text style={styles.optionText}>Upload from Phone</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowSnapOptions(false)} style={[styles.optionButton, { backgroundColor: '#eee' }]}>
                <Text style={{ textAlign: 'center', color: '#444' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

       <WriteMealModal
  visible={showWriteModal}
  onClose={() => {
    setShowWriteModal(false);
    setNewMealName('');
setIngredients([]);
setInstructions([]);
setImageUri('');
setFoodImageUri('');
    if (writeModalSource === 'snap' || writeModalSource === 'paste') {
      setAddMealModalVisible(true);
    }

    setWriteModalSource(null);
  }}
  mealType="Custom"
  mealName={newMealName}
  onChangeMealName={setNewMealName}
  onSave={handleSaveMeal}
  imageUri={foodImageUri}
  onImageSelect={setFoodImageUri}
  ingredients={ingredients}
  instructions={instructions}
  prepTime=""
  cookTime=""
  course=""
  cuisine=""
  nutrition={{ calories: '', protein: '', carbs: '', fats: '' }}
/>


        <PasteModal
  visible={showPasteModal}
  onClose={() => setShowPasteModal(false)}
  onSubmit={(text) => {
    const { mealTitle, ingredientsList, instructionsList } = processScannedRecipe(text);
    setNewMealName(mealTitle);
    setIngredients(ingredientsList);
    setInstructions(instructionsList);
    setShowWriteModal(true);
  }}
/>

<KitchenRecipesModal
  visible={showKitchenModal}
  onClose={() => setShowKitchenModal(false)}
  onSelect={(recipe) => {
    setShowKitchenModal(false);
    setSelectedRecipe(recipe);
    setPreviewModalVisible(true);
  }}
/>

<PreviewRecipeModal
  visible={previewModalVisible}
  recipe={selectedRecipe}
  onClose={() => setPreviewModalVisible(false)}
  onAdd={(notes) => {
    setPreviewModalVisible(false);
    setNewMealName(selectedRecipe.title);
    setIngredients(selectedRecipe.ingredients || []);
    setInstructions(selectedRecipe.instructions || []);
    setCourse(selectedRecipe.course || '');
    setCuisine(selectedRecipe.cuisine || '');
    setPrepTime(selectedRecipe.prepTime || '');
    setCookTime(selectedRecipe.cookTime || '');
    setNutrition(selectedRecipe.nutrition || null);
    setShowWriteModal(true); 
  }}
/>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9FCD7',
    paddingHorizontal: width * 0.05,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  calendarIcon: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  scrollContent: {
    paddingBottom: height * 0.1,
    flexGrow: 1,
  },
  todayLabel: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  mealSection: {
    marginBottom: height * 0.03,
  },
  mealTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  mealBox: {
    backgroundColor: '#FCFCEA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  mealText: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#333',
  },
  icons: {
    flexDirection: 'row',
    gap: 10,
  },
  icon: {
    marginRight: 8,
  },
  addMealText: {
    fontSize: width * 0.035,
    color: '#00C851',
    fontWeight: '600',
    marginTop: 6,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#00C851',
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  optionButton: {
    backgroundColor: '#00C851',
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  optionText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
