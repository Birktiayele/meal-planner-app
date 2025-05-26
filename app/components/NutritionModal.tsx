// NutritionModal.tsx
// Modal for displaying or editing the nutritional information of a meal.
// Supports fields like calories, protein, carbs, fats, and optional nutrition notes.
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NutritionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { calories: string; protein: string; carbs: string; fats: string }) => void;
  nutrition?: { calories: string; protein: string; carbs: string; fats: string }; 
}

export default function NutritionModal({
  visible,
  onClose,
  onSave,
  nutrition, 
}: NutritionModalProps) {
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  useEffect(() => {
    if (visible && nutrition) {
      setCalories(nutrition.calories || '');
      setProtein(nutrition.protein || '');
      setCarbs(nutrition.carbs || '');
      setFats(nutrition.fats || '');
    }
  }, [visible, nutrition]);

  const handleSave = () => {
    onSave({ calories, protein, carbs, fats });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.headerButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Nutrition</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.headerButton}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.form}>
            <Text style={styles.label}>Calories</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 450"
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
            />

            <Text style={styles.label}>Protein (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 30"
              keyboardType="numeric"
              value={protein}
              onChangeText={setProtein}
            />

            <Text style={styles.label}>Carbs (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 50"
              keyboardType="numeric"
              value={carbs}
              onChangeText={setCarbs}
            />

            <Text style={styles.label}>Fats (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 20"
              keyboardType="numeric"
              value={fats}
              onChangeText={setFats}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E9FCD7',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  headerButton: {
    fontSize: 16,
    color: '#00C851',
    fontWeight: '600',
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
});
