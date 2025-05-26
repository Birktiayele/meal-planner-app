// WriteMealModal.tsx
// Full-screen modal for manually writing a new meal.
// Supports inputs for title, meal type, prep/cook time, ingredients, instructions, and notes.
// Used when users choose to write their own meals from scratch.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import NutritionModal from './NutritionModal';
import CourseModal from './CourseModal';
import MealTagModal from './MealTagModal';
import IngredientsModal from './IngredientsModal';
import InstructionsModal from './InstructionsModal';
import CuisineModal from './CuisineModal';

const { width, height } = Dimensions.get('window');

function formatISODuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;

  const parts = [];
  if (hours) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
  if (minutes) parts.push(`${minutes} min`);

  return parts.join(' ') || '0 min';
}
export default function WriteMealModal({
  onClose,
  mealType,
  mealName,
  onChangeMealName,
  onSave,
  visible,
  imageUri,
  ingredients,
  instructions,
  prepTime: prepTimeProp,
  cookTime: cookTimeProp,
  course,
  cuisine: cuisineProp,
  nutrition: nutritionProp,
  onImageSelect,  
}) {
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [tempSelectedCourse, setTempSelectedCourse] = useState(course || '');
  const [cuisine, setCuisine] = useState(cuisineProp || '');
  const [nutrition, setNutrition] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const [localImageUri, setLocalImageUri] = useState(imageUri || null);
  const [localIngredients, setLocalIngredients] = useState(ingredients || []);
  const [localInstructions, setLocalInstructions] = useState(instructions || []);

  const [nutritionModalVisible, setNutritionModalVisible] = useState(false);
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [mealTagModalVisible, setMealTagModalVisible] = useState(false);
  const [cuisineModalVisible, setCuisineModalVisible] = useState(false);
  const [ingredientsModalVisible, setIngredientsModalVisible] = useState(false);
  const [instructionsModalVisible, setInstructionsModalVisible] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setLocalIngredients(ingredients || []);
    setLocalInstructions(instructions || []);
  }, [visible, ingredients, instructions]);

  useEffect(() => {
    if (visible) {
      if (prepTimeProp) setPrepTime(formatISODuration(prepTimeProp));
      if (cookTimeProp) setCookTime(formatISODuration(cookTimeProp));
    }
  }, [visible, prepTimeProp, cookTimeProp]);

  useEffect(() => {
    if (visible) {
      setTempSelectedCourse(course || '');
      setCuisine(cuisineProp || '');
    }
  }, [visible, course, cuisineProp]);

  useEffect(() => {
    if (visible && nutritionProp) {
      setNutrition(nutritionProp);
    }
  }, [visible, nutritionProp]);

useEffect(() => {
  if (visible) {
    setLocalImageUri(imageUri || null);
  }
}, [visible, imageUri]);



 const handleImageUpload = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission needed to access media library.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.7,
  });

  if (!result.canceled && result.assets?.[0]?.uri) {
    const uri = result.assets[0].uri;
    setLocalImageUri(uri);          
    onImageSelect?.(uri);           
  }
};

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={onClose}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={onSave}><Text style={styles.saveText}>Save</Text></TouchableOpacity>
            </View>

            <View style={styles.card}>
              <TextInput
                style={styles.inputBox}
                placeholder="Meal Title"
                value={mealName}
                onChangeText={onChangeMealName}
              />

              <TouchableOpacity style={styles.imageUploadBox} onPress={handleImageUpload}>
                {localImageUri ? (
                  <Image source={{ uri: localImageUri }} style={styles.imagePreview} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera" size={32} color="#888" />
                    <Text style={styles.imagePlaceholderText}>Add Image</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Course */}
              <TouchableOpacity style={styles.row} onPress={() => setCourseModalVisible(true)}>
                <Text style={styles.rowLabel}>Course</Text>
                <View style={styles.rowRight}><Text style={styles.rowValue}>{tempSelectedCourse || 'Select Course'}</Text><Ionicons name="chevron-forward" size={20} color="#888" /></View>
              </TouchableOpacity>

              {/* Cuisine */}
              <TouchableOpacity style={styles.row} onPress={() => setCuisineModalVisible(true)}>
                <Text style={styles.rowLabel}>Cuisine</Text>
                <View style={styles.rowRight}><Text style={styles.rowValue}>{cuisine || 'Select Cuisine'}</Text><Ionicons name="chevron-forward" size={20} color="#888" /></View>
              </TouchableOpacity>

              {/* Nutrition */}
              <TouchableOpacity style={styles.row} onPress={() => setNutritionModalVisible(true)}>
  <Text style={styles.rowLabel}>Nutrition</Text>
  <View style={styles.rowRight}>
    <Text style={styles.rowValue}>
      {nutrition?.calories ? `${nutrition.calories} kcal` : 'Tap to add'}
    </Text>
    <Ionicons name="chevron-forward" size={20} color="#888" />
  </View>
</TouchableOpacity>


              {/* Prep/Cook Time */}
              <View style={styles.rowInputs}>
                <View style={styles.halfInputWrap}><TextInput style={styles.inputBox} placeholder="Prep Time" value={prepTime} onChangeText={setPrepTime} /></View>
                <View style={styles.halfInputWrap}><TextInput style={styles.inputBox} placeholder="Cook Time" value={cookTime} onChangeText={setCookTime} /></View>
              </View>

              {/* Ingredients */}
              <TouchableOpacity style={styles.row} onPress={() => setIngredientsModalVisible(true)}>
                <Text style={styles.rowLabel}>Ingredients</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
              </TouchableOpacity>
              {localIngredients.length > 0 && localIngredients.map((item, index) => <Text key={index} style={{ fontSize: 14, color: '#555' }}>• {item}</Text>)}

              {/* Instructions */}
              <TouchableOpacity style={[styles.row, { marginTop: 20 }]} onPress={() => setInstructionsModalVisible(true)}>
                <Text style={styles.rowLabel}>Instructions</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
              </TouchableOpacity>
              {localInstructions.length > 0 && localInstructions.map((step, index) => <Text key={index} style={{ fontSize: 14, color: '#555' }}>{index + 1}. {step}</Text>)}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <CourseModal visible={courseModalVisible} selectedCourse={tempSelectedCourse || ''} onClose={() => setCourseModalVisible(false)} onSave={(course) => { setTempSelectedCourse(course); setCourseModalVisible(false); }} />
        <CuisineModal visible={cuisineModalVisible} selectedCuisine={cuisine || ''} onClose={() => setCuisineModalVisible(false)} onSave={(selected) => { setCuisine(selected); setCuisineModalVisible(false); }} />
        <NutritionModal visible={nutritionModalVisible} onClose={() => setNutritionModalVisible(false)} onSave={(data) => setNutrition(data)}  nutrition={nutrition}/>
        <IngredientsModal visible={ingredientsModalVisible} ingredients={localIngredients} onClose={() => setIngredientsModalVisible(false)} onSave={(list) => setLocalIngredients(list)} />
        <InstructionsModal visible={instructionsModalVisible} instructions={localInstructions} onClose={() => setInstructionsModalVisible(false)} onSave={(list) => setLocalInstructions(list)} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9FCD7',
    paddingHorizontal: width < 350 ? 12 : 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 10,
  },
  cancelText: { fontSize: 16, color: '#888', fontWeight: '600' },
  saveText: { fontSize: 16, color: '#00C851', fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    padding: 12,
    marginBottom: 16,
  },
  imageUploadBox: {
    marginBottom: 16,
    height: height * 0.22,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderText: { marginTop: 8, color: '#888' },
  imagePreview: { width: '100%', height: '100%', borderRadius: 8 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  rowLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowValue: { fontSize: 15, color: '#555' },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 16 },
  halfInputWrap: { flex: 1 },
});
